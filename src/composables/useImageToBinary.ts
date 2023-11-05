export async function useImageToBinary(uri: string) {
  const data = await (await fetch(uri)).arrayBuffer();
  return data;
}
