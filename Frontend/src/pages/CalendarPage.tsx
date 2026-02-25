
import { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameDay,
} from "date-fns";

import PageHeader from "../ui/PageHeader";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Select from "../ui/Select";

import type { CalendarEvent, EventType } from "../types";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<EventType>("Class");

  const todayISO = format(new Date(), "yyyy-MM-dd");

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const selectedEvents = events.filter((e) => e.date === selectedDate);

  // Ensure selected date stays valid when switching months
  useEffect(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const selected = new Date(selectedDate);

    if (selected < start || selected > end) {
      setSelectedDate(format(start, "yyyy-MM-dd"));
    }
  }, [currentMonth]);

  // Add event
  const handleAddEvent = () => {
    if (!newTitle.trim()) return;

    const newEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      type: newType,
      date: selectedDate,
    };

    setEvents((prev) => [...prev, newEvent]);
    setNewTitle("");
    setNewType("Class");
    setShowAddEvent(false);
  };

  // Google Calendar .ics import
  const handleICSImport = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split("\n");

    const imported: CalendarEvent[] = [];
    let title = "";
    let date = "";

    for (const line of lines) {
      if (line.startsWith("SUMMARY:")) {
        title = line.replace("SUMMARY:", "").trim();
      }
      if (line.startsWith("DTSTART")) {
        const raw = line.split(":")[1].trim();
        date = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
      }
      if (line.startsWith("END:VEVENT")) {
        imported.push({
          id: crypto.randomUUID(),
          title,
          type: "Other",
          date,
        });
      }
    }

    setEvents((prev) => [...prev, ...imported]);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <PageHeader
        title="Calendar"
        subtitle="View your schedule and deadlines"
      >
        <div className="flex gap-3">
          <input
            type="file"
            accept=".ics"
            className="hidden"
            id="icsUpload"
            onChange={handleICSImport}
          />

          <Button
            variant="outline"
            className="border-purple-300 text-purple-600 hover:bg-purple-100"
            onClick={() =>
              document.getElementById("icsUpload")?.click()
            }
          >
            Import from Google Calendar
          </Button>

          <Button
            className="bg-purple-500 hover:bg-purple-600 text-white"
            onClick={() => setShowAddEvent(true)}
          >
            Add Event
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE — Calendar */}
        <Card className="lg:col-span-2 rounded-3xl border border-purple-100 shadow-sm">

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              className="border-purple-300 text-purple-600 hover:bg-purple-100"
              onClick={() =>
                setCurrentMonth((prev) => subMonths(prev, 1))
              }
            >
              Previous
            </Button>

            <h3 className="text-xl font-semibold text-purple-700">
              {format(currentMonth, "MMMM yyyy")}
            </h3>

            <Button
              variant="outline"
              className="border-purple-300 text-purple-600 hover:bg-purple-100"
              onClick={() =>
                setCurrentMonth((prev) => addMonths(prev, 1))
              }
            >
              Next
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-3">
            {days.map((day) => {
              const iso = format(day, "yyyy-MM-dd");
              const isSelected = iso === selectedDate;
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={iso}
                  onClick={() => setSelectedDate(iso)}
                  className={`
                    p-3 rounded-xl text-center transition shadow-sm
                    ${isSelected
                      ? "bg-purple-500 text-white shadow-md"
                      : "bg-purple-50 hover:bg-purple-100"
                    }
                    ${!isSelected && isToday
                      ? "border-2 border-purple-400"
                      : ""
                    }
                  `}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        </Card>

        {/* RIGHT SIDE — Events */}
        <Card className="rounded-3xl border border-purple-100 shadow-sm">
          <h3 className="text-lg font-semibold text-purple-700">
            {format(new Date(selectedDate), "MMMM d, yyyy")}
          </h3>
          <p className="text-gray-500">
            {selectedEvents.length} item(s) scheduled
          </p>

          {selectedEvents.length === 0 ? (
            <p className="text-gray-500 mt-3">
              No tasks or events scheduled for this day.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {selectedEvents.map((e) => (
                <li
                  key={e.id}
                  className="p-3 bg-purple-50 rounded-xl border border-purple-100"
                >
                  <strong className="text-purple-700">{e.title}</strong>
                  <p className="text-sm text-gray-500">{e.type}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* ADD EVENT MODAL */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-md rounded-3xl border border-purple-100 shadow-xl p-6">

            <h3 className="text-xl font-semibold text-purple-700 mb-4">
              Add a new event to{" "}
              {format(new Date(selectedDate), "MMMM d, yyyy")}
            </h3>

            <label className="block text-sm font-medium text-gray-600 mb-1">
              Event Title
            </label>
            <Input
              placeholder="e.g., Physics Lecture"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="mb-4 bg-purple-50/40 border-purple-200 focus:border-purple-400"
            />

            <label className="block text-sm font-medium text-gray-600 mb-1">
              Event Type
            </label>
            <Select
              value={newType}
              onChange={(e) =>
                setNewType(e.target.value as EventType)
              }
              className="mb-4 bg-purple-50/40 border-purple-200 focus:border-purple-400"
            >
              <option value="Class">Class</option>
              <option value="Exam">Exam</option>
              <option value="Assignment">Assignment</option>
              <option value="Other">Other</option>
            </Select>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                className="border-purple-300 text-purple-600 hover:bg-purple-100"
                onClick={() => setShowAddEvent(false)}
              >
                Cancel
              </Button>

              <Button
                className="bg-purple-500 hover:bg-purple-600 text-white"
                onClick={handleAddEvent}
              >
                Add Event
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

