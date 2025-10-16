import type { AxiosInstance } from "axios";

export function isNotFound(error: any): boolean {
  return Boolean(error?.response?.status === 404);
}

const DEFAULT_ARCHIVIST_CHUNK_SIZE = 512 * 1024; // 512 KiB
const jsonLinePattern = /^\s*\{.+\}\s*$/;

export async function fetchArchivistJsonLines(
  httpClient: AxiosInstance,
  url: string,
  options?: { chunkSize?: number; signal?: AbortSignal },
): Promise<Record<string, unknown>[]> {
  const chunkSize = Math.max(
    options?.chunkSize ?? DEFAULT_ARCHIVIST_CHUNK_SIZE,
    1,
  );
  const results: Record<string, unknown>[] = [];
  let nextStart = 0;
  let carryOver = "";
  let moreData = true;
  let encounteredFramedPayload = false;

  while (moreData) {
    const rangeEnd = nextStart + chunkSize - 1;
    const response = await httpClient.get<ArrayBuffer>(url, {
      responseType: "arraybuffer",
      headers: { Range: `bytes=${nextStart}-${rangeEnd}` },
      transformResponse: (data) => data,
      signal: options?.signal,
      transitional: { forcedJSONParsing: false, silentJSONParsing: true },
      decompress: true,
      validateStatus: (status) =>
        (status >= 200 && status < 300) || status === 416,
    });

    if (response.status === 416) {
      break;
    }

    const buffer = Buffer.from(response.data);
    let payloadText = buffer.toString("utf-8");

    if (!encounteredFramedPayload) {
      try {
        const parsed = JSON.parse(payloadText);
        if (
          parsed &&
          typeof parsed === "object" &&
          typeof (parsed as { data?: unknown }).data === "string"
        ) {
          payloadText = (parsed as { data: string }).data;
          encounteredFramedPayload = true;
          moreData = false;
        }
      } catch {
        // ignore and continue treating as raw stream
      }
    }

    const combined = carryOver + payloadText;
    const lines = combined.split(/\r?\n/);
    carryOver = lines.pop() ?? "";

    for (const line of lines) {
      const candidate = line.trim().replace(/^[\u0000-\u001F]+/, "");
      if (!candidate || !jsonLinePattern.test(candidate)) {
        continue;
      }
      try {
        const parsed = JSON.parse(candidate) as Record<string, unknown>;
        results.push(parsed);
      } catch {
        // Ignore malformed JSON lines
      }
    }

    if (encounteredFramedPayload) {
      break;
    }

    const contentRange = response.headers["content-range"] as
      | string
      | undefined;
    if (response.status === 200 || !contentRange) {
      moreData = false;
      break;
    }

    const match = /bytes\s+(\d+)-(\d+)\/(\d+|\*)/i.exec(contentRange);
    if (match) {
      const endByte = Number(match[2]);
      const totalBytes = match[3] === "*" ? NaN : Number(match[3]);
      nextStart = endByte + 1;
      if (!Number.isNaN(totalBytes)) {
        moreData = endByte < totalBytes - 1;
      } else {
        moreData = buffer.length === chunkSize;
      }
    } else {
      moreData = buffer.length === chunkSize;
      nextStart += buffer.length;
    }
  }

  const finalLine = carryOver.trim().replace(/^[\u0000-\u001F]+/, "");
  if (finalLine && jsonLinePattern.test(finalLine)) {
    try {
      const parsed = JSON.parse(finalLine) as Record<string, unknown>;
      results.push(parsed);
    } catch {
      // Ignore malformed trailing line
    }
  }

  return results;
}
