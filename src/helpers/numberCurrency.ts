const currency = (value?: number, maximumFractionDigits: number = 2) =>
  value?.toLocaleString(undefined, {
    style: "currency",
    maximumFractionDigits,
    currency: "EUR",
  }) || "-";

export default currency;
