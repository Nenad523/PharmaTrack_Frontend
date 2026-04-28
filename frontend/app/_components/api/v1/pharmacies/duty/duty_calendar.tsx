"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { formatShortDate, getLocalDateKey, parseDateKey } from "./date_utils";

type CalendarDay = {
  date: Date;
  dateKey: string;
  isCurrentMonth: boolean;
};

type DutyCalendarProps = {
  selectedDate: string;
  onDateChange: (dateKey: string) => void;
};

const MONTH_LABELS = [
  "Januar",
  "Februar",
  "Mart",
  "April",
  "Maj",
  "Jun",
  "Jul",
  "Avgust",
  "Septembar",
  "Oktobar",
  "Novembar",
  "Decembar",
];

const WEEKDAY_LABELS = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const getMondayFirstIndex = (date: Date) => (date.getDay() + 6) % 7;

export default function DutyCalendar({
  selectedDate,
  onDateChange,
}: DutyCalendarProps) {
  const [viewDate, setViewDate] = useState(() => parseDateKey(selectedDate));
  const todayKey = getLocalDateKey(new Date());

  const visibleDays = useMemo<CalendarDay[]>(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const leadingDays = getMondayFirstIndex(firstDay);
    const daysInCurrentMonth = getDaysInMonth(year, month);
    const daysInPreviousMonth = getDaysInMonth(year, month - 1);
    const days: CalendarDay[] = [];

    for (let index = leadingDays - 1; index >= 0; index -= 1) {
      const date = new Date(year, month - 1, daysInPreviousMonth - index);
      days.push({
        date,
        dateKey: getLocalDateKey(date),
        isCurrentMonth: false,
      });
    }

    for (let day = 1; day <= daysInCurrentMonth; day += 1) {
      const date = new Date(year, month, day);
      days.push({
        date,
        dateKey: getLocalDateKey(date),
        isCurrentMonth: true,
      });
    }

    const trailingDays = 42 - days.length;

    for (let day = 1; day <= trailingDays; day += 1) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        dateKey: getLocalDateKey(date),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [viewDate]);

  const changeMonth = (offset: number) => {
    setViewDate(
      (current) => new Date(current.getFullYear(), current.getMonth() + offset, 1)
    );
  };

  const handleDayClick = (day: CalendarDay) => {
    setViewDate(new Date(day.date.getFullYear(), day.date.getMonth(), 1));
    onDateChange(day.dateKey);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    onDateChange(todayKey);
  };

  return (
    <section className="rounded-[24px] border border-blue-200/80 bg-white p-4 shadow-[0_18px_36px_-24px_rgba(37,99,235,0.55),0_8px_18px_-14px_rgba(15,23,42,0.28)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <CalendarDays className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase text-blue-600">
              Datum
            </p>
            <h2 className="text-sm font-bold text-slate-900">
              {MONTH_LABELS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            aria-label="Prethodni mjesec"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            aria-label="Sljedeći mjesec"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAY_LABELS.map((day) => (
          <span
            key={day}
            className="flex h-7 items-center justify-center text-[11px] font-semibold text-slate-400"
          >
            {day}
          </span>
        ))}

        {visibleDays.map((day) => {
          const isSelected = day.dateKey === selectedDate;
          const isToday = day.dateKey === todayKey;

          return (
            <button
              key={day.dateKey}
              type="button"
              onClick={() => handleDayClick(day)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition ${
                isSelected
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
                  : isToday
                    ? "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                    : day.isCurrentMonth
                      ? "text-slate-800 hover:bg-slate-100"
                      : "text-slate-300 hover:bg-slate-50 hover:text-slate-500"
              }`}
              aria-pressed={isSelected}
              aria-label={`Odaberi ${day.date.getDate()}. dan`}
            >
              {day.date.getDate()}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleTodayClick}
        className="mt-4 w-full rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-100"
      >
        Danas, {formatShortDate(new Date())}
      </button>
    </section>
  );
}
