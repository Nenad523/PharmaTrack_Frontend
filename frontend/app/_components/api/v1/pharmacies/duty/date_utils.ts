const MONTH_NAMES = [
  "januar",
  "februar",
  "mart",
  "april",
  "maj",
  "jun",
  "jul",
  "avgust",
  "septembar",
  "oktobar",
  "novembar",
  "decembar",
];

const WEEKDAY_NAMES = [
  "nedjelja",
  "ponedjeljak",
  "utorak",
  "srijeda",
  "četvrtak",
  "petak",
  "subota",
];

const PODGORICA_TIME_ZONE = "Europe/Podgorica";

const padTwo = (value: number) => String(value).padStart(2, "0");

export const getLocalDateKey = (date: Date) =>
  `${date.getFullYear()}-${padTwo(date.getMonth() + 1)}-${padTwo(
    date.getDate()
  )}`;

export const parseDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);

  if (!year || !month || !day) {
    return new Date();
  }

  return new Date(year, month - 1, day);
};

export const formatFullDate = (dateKey: string) => {
  const date = parseDateKey(dateKey);
  const weekday = WEEKDAY_NAMES[date.getDay()];
  const month = MONTH_NAMES[date.getMonth()];

  return `${weekday}, ${date.getDate()}. ${month} ${date.getFullYear()}.`;
};

export const formatShortDate = (date: Date) =>
  `${date.getDate()}. ${MONTH_NAMES[date.getMonth()]}`;

const parseDateTimeParts = (value: string) => {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:T| )(\d{2}):(\d{2})/
  );

  if (!match) {
    return null;
  }

  return {
    year: match[1],
    month: match[2],
    day: match[3],
    hour: match[4],
    minute: match[5],
  };
};

const hasTimezone = (value: string) =>
  /(?:Z|[+-]\d{2}:?\d{2})$/.test(value.trim());

const getZonedDateTimeParts = (date: Date) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: PODGORICA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date).reduce<Record<string, string>>(
    (accumulator, part) => {
      accumulator[part.type] = part.value;
      return accumulator;
    },
    {}
  );

  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
  };
};

export const formatTime = (value: string) => {
  if (!value) {
    return "Nije dostupno";
  }

  if (hasTimezone(value)) {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      const parts = getZonedDateTimeParts(date);
      return `${parts.hour}:${parts.minute}`;
    }
  }

  const parts = parseDateTimeParts(value) ?? value.match(/^(\d{2}):(\d{2})/);

  if (parts && Array.isArray(parts)) {
    return `${parts[1]}:${parts[2]}`;
  }

  if (parts && "hour" in parts) {
    return `${parts.hour}:${parts.minute}`;
  }

  return value;
};

export const formatDateTime = (value: string) => {
  if (!value) {
    return "Nije dostupno";
  }

  if (hasTimezone(value)) {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      const parts = getZonedDateTimeParts(date);
      return `${parts.day}.${parts.month}.${parts.year}. ${parts.hour}:${parts.minute}`;
    }
  }

  const parts = parseDateTimeParts(value);

  if (!parts) {
    return value;
  }

  return `${parts.day}.${parts.month}.${parts.year}. ${parts.hour}:${parts.minute}`;
};

export const formatDutyTimeRange = (start: string, end: string) =>
  `${formatTime(start)} - ${formatTime(end)}`;
