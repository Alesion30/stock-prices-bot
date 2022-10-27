export const castSafetyNumber = (str: string | null) => {
  if (str === null) return null;
  const num = Number(str);
  return isNaN(num) ? null : num;
};
