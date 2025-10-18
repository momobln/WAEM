"use client";
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function ShiftsPage() {
  const { data: session, status } = useSession();
  const [shifts, setShifts] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const load = async () => {
    const res = await fetch("/api/shifts");
    if (res.ok) setShifts(await res.json());
  };

  useEffect(() => {
    if (status === "authenticated") load();
  }, [status]);

  const addShift = async () => {
    await fetch("/api/shifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, location, start, end }),
    });
    setTitle("");
    setLocation("");
    setStart("");
    setEnd("");
    await load();
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!session)
    return (
      <div style={{ padding: 40 }}>
        <p>You must sign in first</p>
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      </div>
    );

  return (
    <div style={{ padding: 40 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <strong>{session.user?.email}</strong>
        <button onClick={() => signOut()}>Sign out</button>
      </div>

      <h1>Shifts</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" />
        <input type="datetime-local" value={start} onChange={e => setStart(e.target.value)} />
        <input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} />
        <button onClick={addShift}>Add</button>
      </div>

      <ul>
        {shifts.map(s => (
          <li key={s.id}>
            <strong>{s.title}</strong> — {s.location}  
            <br />
            {new Date(s.start).toLocaleString()} → {new Date(s.end).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
