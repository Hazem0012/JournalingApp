const ordinalSuffix = (day: number) => {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const normalizeDate = (value: Date | string | number) => {
  if (typeof value === "string") {
    const date = value.replace(" ", "T");
    const hasZone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(date);
    return new Date(hasZone ? date : `${date}Z`);
  }
  return new Date(value);
};

export const formatDisplayDate = (value: Date | string | number) => {
  const date = normalizeDate(value);
  if (Number.isNaN(date.getTime())) 
    return "";

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone,
  });

  const parts = formatter.formatToParts(date);
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const day = Number(parts.find((p) => p.type === "day")?.value ?? 0);

  return `${month.slice(0,3)} ${day}${ordinalSuffix(day)}, ${year}`;
};

export const formatDisplayTime = (value: Date | string | number) => {
  const date = normalizeDate(value);
  if (Number.isNaN(date.getTime())) 
    return "";

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  });
  return formatter.format(date);
};
