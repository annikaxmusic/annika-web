import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useContent } from "@/context/ContentContext";

const padNumber = (value: number, length = 2) => value.toString().padStart(length, "0");

const normalizeDate = (raw?: string) => {
  if (!raw) {
    return "";
  }

  const value = raw.trim();

  if (!value) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const match = value.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);

  if (!match) {
    return "";
  }

  const [, dayStr, monthStr, yearStr] = match;
  const day = padNumber(Number.parseInt(dayStr, 10));
  const month = padNumber(Number.parseInt(monthStr, 10));
  let year = Number.parseInt(yearStr, 10);

  if (Number.isNaN(year)) {
    return "";
  }

  if (yearStr.length === 2) {
    year += 2000;
  }

  return `${padNumber(year, 4)}-${month}-${day}`;
};

const normalizeTime = (raw?: string) => {
  if (!raw) {
    return "";
  }

  const value = raw.trim();

  if (!value) {
    return "";
  }

  const match = value.match(/^(\d{1,2})(?::(\d{1,2}))?$/);

  if (!match) {
    return "";
  }

  const hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2] ?? "0", 10);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return "";
  }

  return `${padNumber(hours)}:${padNumber(minutes)}`;
};

const buildEventDate = (date?: string, time?: string) => {
  const normalizedDate = normalizeDate(date);

  if (!normalizedDate) {
    return null;
  }

  const normalizedTime = normalizeTime(time);
  const candidate = new Date(`${normalizedDate}T${normalizedTime || "00:00"}`);

  if (Number.isNaN(candidate.getTime())) {
    return null;
  }

  return { date: candidate, hasTime: Boolean(normalizedTime) };
};

const formatDisplayDate = (eventInfo: ReturnType<typeof buildEventDate>, fallbackDate?: string, fallbackTime?: string) => {
  if (eventInfo?.date) {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
      ...(eventInfo.hasTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    };

    return new Intl.DateTimeFormat(undefined, options).format(eventInfo.date);
  }

  return [fallbackDate, fallbackTime].filter(Boolean).join(" · ");
};

const formatExactDateTime = (eventInfo: ReturnType<typeof buildEventDate>) => {
  if (!eventInfo?.date) {
    return "";
  }

  const options: Intl.DateTimeFormatOptions = {
    dateStyle: "full",
  };

  if (eventInfo.hasTime) {
    options.timeStyle = "short";
  }

  return new Intl.DateTimeFormat(undefined, options).format(eventInfo.date);
};

const buildCountdown = (eventInfo: ReturnType<typeof buildEventDate>, now: Date) => {
  if (!eventInfo?.date) {
    return null;
  }

  const diffMs = eventInfo.date.getTime() - now.getTime();

  if (diffMs <= 0) {
    return "Event started";
  }

  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const parts = [
    `${days}d`,
    `${hours}h`,
    `${minutes}m`,
  ];

  return `Starts in ${parts.join(" ")}`;
};

const ConcertsSection = () => {
  const { content } = useContent();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);
  
  return (
    <section className="w-full px-4 sm:px-8 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Concerts</h2>
      <div className="max-w-md">
        {content.concerts.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Add upcoming shows in the admin to display them here.
          </p>
        )}

        {content.concerts.map((concert, index) => {
          const eventInfo = buildEventDate(concert.date, concert.time);
          const displayDate = formatDisplayDate(eventInfo, concert.date, concert.time);
          const countdownText = buildCountdown(eventInfo, now);
          const exactDateTime = formatExactDateTime(eventInfo);

          const rowContent = (
            <>
              <span>{concert.event}</span>
              <span>{displayDate}</span>
            </>
          );

          const tooltipContent = countdownText ?? "Add a valid date & time to show a countdown.";

          const trigger = concert.url ? (
            <a
              href={concert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between py-2 border-b border-foreground hover:opacity-70 transition-opacity"
            >
              {rowContent}
            </a>
          ) : (
            <div className="flex justify-between py-2 border-b border-foreground">
              {rowContent}
            </div>
          );

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>{trigger}</TooltipTrigger>
              <TooltipContent className="max-w-xs space-y-1 text-center">
                <p>{tooltipContent}</p>
                {exactDateTime && <p className="text-xs text-muted-foreground">{exactDateTime}</p>}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </section>
  );
};

export default ConcertsSection;
