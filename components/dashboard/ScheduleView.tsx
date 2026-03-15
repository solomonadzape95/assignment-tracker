/* eslint-disable no-console */
"use client";

import { useMemo, useState } from "react";
import { useAssignments } from "@/hooks/useAssignments";
import { AssignmentCard } from "@/components/dashboard/AssignmentCard";
import { DashboardBottomNav } from "@/components/dashboard/DashboardBottomNav";
import { Icon } from "@/components/common/Icon";

interface ScheduleViewProps {
  studentId: string;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = day; // start week on Sunday to match ui/schedule mock
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function ScheduleView({ studentId }: ScheduleViewProps) {
  const { assignments, loading, error } = useAssignments(studentId);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const weekDates = useMemo(() => {
    const start = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, index) => {
      const d = new Date(start);
      d.setDate(start.getDate() + index);
      return d;
    });
  }, [selectedDate]);

  const tasksByDay = useMemo(() => {
    return assignments.reduce<Record<string, number>>((acc, assignment) => {
      const deadline = new Date(assignment.deadline);
      const key = deadline.toISOString().slice(0, 10);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
  }, [assignments]);

  const tasksForSelected = useMemo(
    () =>
      assignments
        .filter((assignment) =>
          isSameDay(new Date(assignment.deadline), selectedDate),
        )
        .sort(
          (a, b) =>
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
        ),
    [assignments, selectedDate],
  );

  const monthLabel = selectedDate.toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });

  const dayLabel = selectedDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Icon
            name="calendar_today"
            size={24}
            className="text-primary"
          />
          <h1 className="text-xl font-bold tracking-tight">Schedule</h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Search"
          >
            <Icon name="search" size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 bg-background-light dark:bg-background-dark">
        {/* Weekly calendar strip */}
        <section className="p-4 bg-white dark:bg-background-dark">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {monthLabel}
            </h2>
            <div className="flex gap-1">
              <button
                type="button"
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Previous week"
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() - 7);
                  setSelectedDate(d);
                }}
              >
                <Icon name="chevron_left" size={18} />
              </button>
              <button
                type="button"
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Next week"
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() + 7);
                  setSelectedDate(d);
                }}
              >
                <Icon name="chevron_right" size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {weekDates.map((date) => {
              const isSelected = isSameDay(date, selectedDate);
              const key = date.toISOString().slice(0, 10);
              const count = tasksByDay[key] ?? 0;
              const weekday = date
                .toLocaleDateString(undefined, { weekday: "short" })
                .toUpperCase();

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center py-2 rounded-xl ${
                    isSelected ? "bg-primary/10" : ""
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold mb-1 ${
                      isSelected
                        ? "text-primary"
                        : "text-slate-400 dark:text-slate-400"
                    }`}
                  >
                    {weekday}
                  </span>
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium ${
                      isSelected
                        ? "bg-primary text-white"
                        : "text-slate-700 dark:text-slate-100"
                    }`}
                  >
                    {date.getDate()}
                  </div>
                  {count > 0 ? (
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: Math.min(count, 3) }).map(
                        (_, index) => (
                          <div
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                            className="size-1 bg-primary rounded-full"
                          />
                        ),
                      )}
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </section>

        {/* Assignments list */}
        <section className="mt-2 px-4 space-y-4">
          <div className="flex items-center justify-between pt-4 pb-2">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
              Deadlines for {dayLabel}
            </h3>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
              {tasksForSelected.length}{" "}
              {tasksForSelected.length === 1 ? "Task" : "Tasks"}
            </span>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Loading schedule…
            </p>
          ) : error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : tasksForSelected.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              You have no assignments due on this day.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {tasksForSelected.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                studentId={studentId}
              />
              ))}
            </div>
          )}
        </section>
      </main>

      <DashboardBottomNav />
    </>
  );
}

