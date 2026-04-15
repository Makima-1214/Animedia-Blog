export async function parseRequest(request: Request): Promise<Record<string, string>> {
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return await request.json();
  }
  const formData = await request.formData();
  const result: Record<string, string> = {};
  formData.forEach((value, key) => { result[key] = value.toString(); });
  return result;
}
