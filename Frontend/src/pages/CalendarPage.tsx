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
    <div>
      <PageHeader title="Calendar" subtitle="View your schedule and deadlines">
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
            onClick={() =>
              document.getElementById("icsUpload")?.click()
            }
          >
            Import from Google Calendar
          </Button>

          <Button onClick={() => setShowAddEvent(true)}>Add Event</Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-3 gap-6">
        {/* LEFT SIDE — Calendar */}
        <Card className="col-span-2">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentMonth((prev) => subMonths(prev, 1))
              }
            >
              Previous
            </Button>

            <h3>{format(currentMonth, "MMMM yyyy")}</h3>

            <Button
              variant="outline"
              onClick={() =>
                setCurrentMonth((prev) => addMonths(prev, 1))
              }
            >
              Next
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
              const iso = format(day, "yyyy-MM-dd");
              const isSelected = iso === selectedDate;
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={iso}
                  onClick={() => setSelectedDate(iso)}
                  className={`p-3 rounded-lg text-center transition
                    ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-slate-600"
                    }
                    ${
                      !isSelected && isToday
                        ? "border-2 border-blue-600"
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
        <Card>
          <h3>{format(new Date(selectedDate), "MMMM d, yyyy")}</h3>
          <p>{selectedEvents.length} item(s) scheduled</p>

          {selectedEvents.length === 0 ? (
            <p className="text-gray-500 dark:text-slate-400 mt-2">
              No tasks or events scheduled for this day.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {selectedEvents.map((e) => (
                <li key={e.id}>
                  <strong>{e.title}</strong>
                  <p className="text-sm text-gray-500">{e.type}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* ADD EVENT MODAL */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <h3 className="mb-2">
              Add a new event to{" "}
              {format(new Date(selectedDate), "MMMM d, yyyy")}
            </h3>

            <label className="block mb-1">Event Title</label>
            <Input
              placeholder="e.g., Physics Lecture"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="mb-4"
            />

            <label className="block mb-1">Event Type</label>
            <Select
              value={newType}
              onChange={(e) =>
                setNewType(e.target.value as EventType)
              }
              className="mb-4"
            >
              <option value="Class">Class</option>
              <option value="Exam">Exam</option>
              <option value="Assignment">Assignment</option>
              <option value="Other">Other</option>
            </Select>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddEvent(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>Add Event</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
