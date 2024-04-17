export function formatToVND(number) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return formatter.format(number);
}

export function formatNumber(number) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal', // Format as a number
    minimumFractionDigits: 2, // Enforce 2 decimal places
    maximumFractionDigits: 2, // Enforce 2 decimal places
  });

  return formatter.format(number);
}
