"use client";
import { useEffect, useState } from "react";
import { useSession, signOut, signIn } from "next-auth/react";

export default function GuardsPage() {
  const { data: session, status } = useSession();
  const [guards, setGuards] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const load = async () => {
    const res = await fetch("/api/guards");
    if (res.ok) setGuards(await res.json());
  };

  useEffect(() => {
    if (status === "authenticated") load();
  }, [status]);

  const addGuard = async () => {
    await fetch("/api/guards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    });
    setName("");
    setEmail("");
    setPhone("");
    await load();
  };

  const deleteGuard = async (id: string) => {
    await fetch(`/api/guards/${id}`, { method: "DELETE" });
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

      <h1>Guards</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
        <button onClick={addGuard}>Add Guard</button>
      </div>

      <ul>
        {guards.map(g => (
          <li key={g.id} style={{ marginBottom: 8 }}>
            <strong>{g.name}</strong> — {g.email} {g.phone && `(${g.phone})`}
            <button style={{ marginLeft: 8 }} onClick={() => deleteGuard(g.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
