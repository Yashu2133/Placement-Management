export const fmt = (d) => {
  if (!d) return "-"
  const dt = new Date(d)
  return dt.toLocaleString()
}
