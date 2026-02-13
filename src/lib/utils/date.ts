import { format, formatDistanceToNow } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";

export function toJalali(date: Date | string): string {
  return format(new Date(date), "d MMMM yyyy", { locale: faIR });
}

export function toJalaliWithTime(date: Date | string): string {
  return format(new Date(date), "d MMMM yyyy - HH:mm", { locale: faIR });
}

export function timeAgo(date: Date | string): string {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: faIR,
  });
}

export function toJalaliShort(date: Date | string): string {
  return format(new Date(date), "yyyy/MM/dd", { locale: faIR });
}
