export function bytesToMB(sizeInBytes: number) {
  const sizeInMB = sizeInBytes / (1024 * 1024);
  return sizeInMB.toFixed(2); // 保留两位小数
}
