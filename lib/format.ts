const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function month(value: string, locale: string) {
  const [y, m] = value.split('-');
  if (!m) return y;
  return locale === 'zh-CN' ? `${y}.${m}` : `${MONTHS[Number(m) - 1]} ${y}`;
}

export function formatPeriod(start: string | undefined, end: string | undefined, locale: string, present: string) {
  if (!start) return '';
  const from = month(start, locale);
  if (!end) return from;
  const to = end.toLowerCase() === 'present' ? present : month(end, locale);
  return `${from} – ${to}`;
}

export function year(start?: string) {
  return start ? start.slice(0, 4) : '';
}
