/**
 * Convert numeric string / number to Indian Rupees in words format.
 * Example: 25000 -> "Twenty-Five Thousand Rupees Only"
 * Example: 750000 -> "Seven Lakh Fifty Thousand Rupees Only"
 */
export function numberToWordsRupees(amountStr: string | number): string {
  const num = Math.floor(Math.abs(Number(amountStr)));
  if (!amountStr || isNaN(num) || num === 0) return "";

  const units = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convertLessThanThousand(n: number): string {
    if (n === 0) return "";
    let str = "";
    if (n >= 100) {
      str += (units.at(Math.floor(n / 100)) ?? "") + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      const tenVal = Math.floor(n / 10);
      const unitVal = n % 10;
      const tenStr = tens.at(tenVal) ?? "";
      const unitStr = unitVal > 0 ? `-${units.at(unitVal) ?? ""}` : "";
      str += tenStr + unitStr + " ";
    } else if (n > 0) {
      str += (units.at(n) ?? "") + " ";
    }
    return str.trim();
  }

  let str = "";
  let temp = num;

  const crore = Math.floor(temp / 10000000);
  temp %= 10000000;
  const lakh = Math.floor(temp / 100000);
  temp %= 100000;
  const thousand = Math.floor(temp / 1000);
  temp %= 1000;
  const remaining = temp;

  if (crore > 0) {
    str += convertLessThanThousand(crore) + " Crore ";
  }
  if (lakh > 0) {
    str += convertLessThanThousand(lakh) + " Lakh ";
  }
  if (thousand > 0) {
    str += convertLessThanThousand(thousand) + " Thousand ";
  }
  if (remaining > 0) {
    str += convertLessThanThousand(remaining) + " ";
  }

  const trimmed = str.trim();
  return trimmed ? `${trimmed} Rupees Only` : "";
}
