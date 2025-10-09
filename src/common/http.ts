export function isNotFound(error: any): boolean {
  return Boolean(error?.response?.status === 404);
}
