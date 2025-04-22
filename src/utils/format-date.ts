import dayjs from "dayjs";

export function formatDate(date: string | Date, format = "DD MMM YYYY") {
  return dayjs(date).format(format);
}
