export async function request(path, options = {}) {
  const response = await fetch(`/api/books${path}`, options);
  if (response.status === 204) return null;
  const body = await response.json();
  if (!response.ok) throw new Error(`${response.status}: ${body.title ?? 'Request failed'}`);
  return body;
}
