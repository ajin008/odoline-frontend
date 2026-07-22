export function formatCurrency(
  amount: string | number | undefined | null
): string {
  const numericVal = Number(amount || 0);
  return numericVal.toLocaleString("en-IN");
}

export function calculateRefurbTotals(
  items: Array<{ cost: string; status: string }>
) {
  const totalCost = items.reduce(
    (sum, item) => sum + Number(item.cost || 0),
    0
  );
  const completedCount = items.filter((item) => item.status === "done").length;
  const progressPercentage =
    items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return {
    totalCost,
    completedCount,
    progressPercentage,
  };
}
