export const formatCurrency = (value) =>
  `₹${Number(value).toLocaleString("en-IN")}`;
