"use client"

import * as React from "react"
import { DayPicker, useDayPicker, type CalendarMonth } from "react-day-picker"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function MonthCaption({ calendarMonth }: { calendarMonth: CalendarMonth }) {
  const { goToMonth, nextMonth, previousMonth } = useDayPicker()

  return (
    <div className="flex items-center justify-between px-1 pb-1">
      <button
        onClick={() => previousMonth && goToMonth(previousMonth)}
        disabled={!previousMonth}
        className="h-7 w-7 flex items-center justify-center rounded-md border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <ChevronLeft size={14} />
      </button>
      <span className="text-sm font-semibold text-[var(--foreground)] capitalize">
        {format(calendarMonth.date, "MMMM yyyy", { locale: ptBR })}
      </span>
      <button
        onClick={() => nextMonth && goToMonth(nextMonth)}
        disabled={!nextMonth}
        className="h-7 w-7 flex items-center justify-center rounded-md border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  )
}

export function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      locale={ptBR}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-2",
        month_caption: "w-full",
        caption_label: "hidden",
        nav: "hidden",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-[var(--muted-foreground)] rounded-md w-9 font-medium text-[0.8rem] text-center",
        week: "flex w-full mt-2",
        day: "relative p-0 text-center",
        day_button: cn(
          "h-9 w-9 flex items-center justify-center rounded-md text-sm font-medium text-[var(--foreground)] transition-colors cursor-pointer",
          "hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        ),
        selected: "[&>button]:bg-[var(--primary)] [&>button]:text-white [&>button]:hover:bg-[var(--primary-dark)]",
        today: "[&>button]:border [&>button]:border-[var(--primary)] [&>button]:font-bold",
        outside: "[&>button]:text-[var(--muted-foreground)] [&>button]:opacity-50",
        disabled: "[&>button]:opacity-30 [&>button]:cursor-not-allowed",
        range_middle: "[&>button]:rounded-none [&>button]:bg-[var(--primary)]/15",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        MonthCaption,
      }}
      {...props}
    />
  )
}
