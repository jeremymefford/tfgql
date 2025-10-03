import { randomBytes } from 'crypto';

function randomHex(bytes: number): string {
  return randomBytes(bytes).toString('hex');
}

export type ParsedTraceparent = {
  version: string;
  traceId: string;
  parentSpanId: string;
  traceFlags: string;
};

const TRACEPARENT_RE = /^(?<version>[\da-f]{2})-(?<traceId>[\da-f]{32})-(?<spanId>[\da-f]{16})-(?<flags>[\da-f]{2})$/i;

export function parseTraceparent(value: string | undefined | null): ParsedTraceparent | null {
  if (!value) return null;
  const m = TRACEPARENT_RE.exec(value.trim());
  if (!m || !m.groups) return null;
  const version = m.groups['version'].toLowerCase();
  const traceId = m.groups['traceId'].toLowerCase();
  const parentSpanId = m.groups['spanId'].toLowerCase();
  const traceFlags = m.groups['flags'].toLowerCase();
  if (/^0{32}$/i.test(traceId) || /^0{16}$/i.test(parentSpanId)) return null; // invalid per spec
  return { version, traceId, parentSpanId, traceFlags };
}

export function generateTraceId(): string {
  // 16 bytes (32 hex chars)
  return randomHex(16);
}

export function generateSpanId(): string {
  // 8 bytes (16 hex chars)
  return randomHex(8);
}

export function formatTraceparent(traceId: string, spanId: string, flags: string = '01', version: string = '00'): string {
  return `${version}-${traceId}-${spanId}-${flags}`;
}
