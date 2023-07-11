export const getSizeBarWidth = (curSize, totalSize) => {
  return ((curSize / totalSize) * 100).toFixed(2) + "%";
};