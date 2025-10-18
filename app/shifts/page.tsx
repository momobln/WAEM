"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

type Shift = {
  id: string;
  title: string;
  location: string;
  start: string;
  end: string;
  owner: {
    id: string;
    name: string | null;
    email: string | null;
    role: "ADMIN" | "USER";
  };
};

type GuardOption = {
  id: string;
  name: string | null;
  email: string | null;
};

const isRedirectPayload = (
  payload: unknown
): payload is { redirect?: string } =>
  Boolean(payload && typeof payload === "object" && "redirect" in payload);

const redirectFromPayload = (payload: unknown) => {
  if (isRedirectPayload(payload) && payload.redirect) {
    window.location.href = payload.redirect;
    return true;
  }
  return false;
};

const redirectFromResponse = (res: Response, payload: unknown) => {
  if (res.redirected) {
    window.location.href = res.url;
    return true;
  }
  return redirectFromPayload(payload);
};

const readJson = async (res: Response) => {
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return null;
};

const toInputDate = (value: string) =>
  value ? new Date(value).toISOString().slice(0, 16) : "";

const formatDate = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function ShiftsPage() {
  const { data: session } = useSession();
  const role = session?.user?.role as "ADMIN" | "USER" | undefined;

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [ownerId, setOwnerId] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [guards, setGuards] = useState<GuardOption[]>([]);

  const loadShifts = useCallback(async () => {
    const res = await fetch("/api/shifts");

    const data = await readJson(res);
    if (redirectFromResponse(res, data)) return;
    if (res.ok && Array.isArray(data)) setShifts(data);
  }, []);

  const loadGuards = useCallback(async () => {
    if (role !== "ADMIN") return;
    const res = await fetch("/api/guards");
    const data = await readJson(res);
    if (redirectFromResponse(res, data)) return;
    if (Array.isArray(data)) setGuards(data);
  }, [role]);

  const resetForm = () => {
    setTitle("");
    setLocation("");
    setStart("");
    setEnd("");
    setOwnerId("");
    setEditingId(null);
  };

  
  
  const submitShift = async () => {
    if (!title || !location || !start || !end) {
      alert("Please fill all fields before saving the shift.");
      return;
    }

    const payload: Record<string, unknown> = {
      title,
      location,
      start,
      end,
    };

    if (role === "ADMIN" && ownerId) {
      payload.ownerId = ownerId;
    }

    const url = editingId ? `/api/shifts/${editingId}` : "/api/shifts";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(payload),
    });

    const data = await readJson(res);
    if (redirectFromResponse(res, data)) return;
    resetForm();
    void loadShifts();
  };

  const deleteShift = async (id: string) => {

    const res = await fetch(`/api/shifts/${id}`, { method: "DELETE" });
    const data = await readJson(res);
    if (redirectFromResponse(res, data)) return;
    if (editingId === id) resetForm();
    loadShifts();
  };

  const startEdit = (shift: Shift) => {
    setEditingId(shift.id);
    setTitle(shift.title);
    setLocation(shift.location);
    setStart(toInputDate(shift.start));
    setEnd(toInputDate(shift.end));
    setOwnerId(shift.owner.id);
  };

  useEffect(() => {

    void loadShifts();
  }, [loadShifts]);

  useEffect(() => {
    void loadGuards();
  }, [loadGuards]);

  const submitLabel = editingId ? "Update Shift" : "Add Shift";

  return (

<main style={{ maxWidth: 720, margin: "auto", padding: 20 }}>
      <h2>My Shifts</h2>
      <p style={{ color: "#64748b", fontSize: 14 }}>
        Signed in as {session?.user?.email} ({role})
      </p>

    
      <div style={{ marginBottom: 24, display: "flex", flexWrap: "wrap", gap: 8 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={event => setTitle(event.target.value)}
          style={{ padding: 8, flex: "1 1 160px" }}
        />
        <input
          placeholder="Location"
          value={location}
          onChange={event => setLocation(event.target.value)}
          style={{ padding: 8, flex: "1 1 160px" }}
        />
        <input
          type="datetime-local"
          value={start}
          onChange={event => setStart(event.target.value)}
          style={{ padding: 8, flex: "1 1 200px" }}
        />
        <input
          type="datetime-local"
          value={end}
          onChange={event => setEnd(event.target.value)}
          style={{ padding: 8, flex: "1 1 200px" }}
        />
        {role === "ADMIN" && (
          <select
            value={ownerId}
            onChange={event => setOwnerId(event.target.value)}
            style={{ padding: 8, flex: "1 1 180px" }}
          >
            <option value="">Assign owner…</option>
            {guards.map(guard => (
              <option key={guard.id} value={guard.id}>
                {guard.name || guard.email} ({guard.email})
              </option>
            ))}
          </select>
        )}
        <button onClick={submitShift} style={{ padding: "8px 16px" }}>
          {submitLabel}
        </button>
        {editingId && (
          <button onClick={resetForm} style={{ padding: "8px 16px" }}>
            Cancel
          </button>
        )}
      </div>

      
      <ul style={{ display: "grid", gap: 12, padding: 0, listStyle: "none" }}>
        {shifts.map(shift => (
          <li
            key={shift.id}
            style={{
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <strong>{shift.title}</strong>
              <p style={{ margin: "4px 0" }}>{shift.location}</p>
              <p style={{ margin: "4px 0", fontSize: 14, color: "#475569" }}>
                {formatDate(shift.start)} → {formatDate(shift.end)}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                Owner: {shift.owner.name || shift.owner.email} ({shift.owner.role})
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => startEdit(shift)}>Edit</button>
              <button onClick={() => deleteShift(shift.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}