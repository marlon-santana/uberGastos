export function formatDateBR(date: string | Date): string {
  let d: Date;
  if (typeof date === "string") {
    d = new Date(date);
    if (date.length === 10 && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Corrige fuso horário para datas YYYY-MM-DD
      d = new Date(date + "T00:00:00");
    }
  } else {
    d = date;
  }
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
