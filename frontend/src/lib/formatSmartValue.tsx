export const formatSmartValue = (value: string | number): string => {
  if (value == null) return "N/A";

  const str = String(value).trim();

  if (/[a-zA-Z₹$€£/]/.test(str)) {
    return str.replace(/\s+/g, " ");
  }

  const num = parseFloat(str);
  if (isNaN(num)) return str;

  const formatted = num.toFixed(2).replace(/\.?0+$/, "");
  return formatted;
};