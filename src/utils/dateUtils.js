import { format, parseISO } from 'date-fns';

export function formatTime(dateStr) {
  if (!dateStr) return '--:--';
  try {
    return format(parseISO(dateStr), 'hh:mm a');
  } catch {
    return '--:--';
  }
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy');
  } catch {
    return dateStr;
  }
}

export function today() {
  return format(new Date(), 'yyyy-MM-dd');
}
