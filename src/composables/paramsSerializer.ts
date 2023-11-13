interface StringLike {
  toString(): string;
}

export function paramsSerializer(
  params: Record<string, StringLike | undefined> | object
) {
  if (!params) return;
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    const value = v?.toString();
    if (!value) {
      return;
    }
    query.append(k, value);
  });
  return "?" + query.toString();
}
