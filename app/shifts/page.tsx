"use client";
import { useState, useEffect } from "react";

type Shift = {
  id: string;
  title: string;
  location: string;
  start: string;
  end: string;
};

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const load = async () => {
    const res = await fetch("/api/shifts");
    if (res.ok) setShifts(await res.json());
  };

  const createShift = async () => {
    await fetch("/api/shifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, location, start, end }),
    });
    load();
  };

  const deleteShift = async (id: string) => {
    await fetch(`/api/shifts/${id}`, { method: "DELETE" });
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>My Shifts</h2>

      <div style={{ marginBottom: 20 }}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
        <input type="datetime-local" value={start} onChange={e => setStart(e.target.value)} />
        <input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} />
        <button onClick={createShift}>Add Shift</button>
      </div>

      <ul>
        {shifts.map(s => (
          <li key={s.id}>
            {s.title} - {s.location} ({s.start} → {s.end}){" "}
            <button onClick={() => deleteShift(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
