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

export function extractNumericValue(price: string): number | null {
  if (!price) return null;

  const numericString = price.replace(/[^0-9०-९]/g, "");

  if (!numericString) return null;

  const englishDigits = numericString.replace(/[०-९]/g, (digit) =>
    String("०१२३४५६७८९".indexOf(digit))
  );

  const num = Number(englishDigits);

  return isNaN(num) ? null : num;
}
