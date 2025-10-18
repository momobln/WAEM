"use client";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function ShiftsPage() {
  const { data: session, status } = useSession();
  const [list, setList] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Berlin");

  const load = async () => {
    const res = await fetch("/api/shifts");
    if (res.ok) setList(await res.json());
  };

  useEffect(() => { if (status === "authenticated") load(); }, [status]);

  const addShift = async () => {
    await fetch("/api/shifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        location,
        start: new Date(),
        end: new Date(Date.now() + 2 * 3600 * 1000),
      }),
    });
    setTitle("");
    await load();
  };

  const delShift = async (id: string) => {
    await fetch(`/api/shifts/${id}`, { method: "DELETE" });
    await load();
  };

  if (status === "loading") return <p style={{padding:40}}>Loading…</p>;
  if (!session)
    return (
      <div style={{padding:40}}>
        <p>Not signed in</p>
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      </div>
    );

  return (
    <div style={{padding:40}}>
      <div style={{display:"flex", gap:12, alignItems:"center"}}>
        <strong>{session.user?.email}</strong>
        <button onClick={() => signOut()}>Sign out</button>
      </div>

      <h1>Shifts</h1>
      <div style={{display:"flex", gap:8}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
        <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Location" />
        <button onClick={addShift}>Add</button>
      </div>

      <ul>
        {list.map(s=>(
          <li key={s.id} style={{marginTop:8}}>
            {s.title} — {s.location}
            <button style={{marginLeft:8}} onClick={()=>delShift(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
