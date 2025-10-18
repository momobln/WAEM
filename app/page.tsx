"use client";
import { signOut, useSession, signIn } from "next-auth/react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();

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
      <h1>Dashboard</h1>
      <p>Signed in as: <strong>{session.user?.email}</strong></p>
      <button onClick={() => signOut()}>Sign out</button>

      <h2 style={{ marginTop: 20 }}>Sections</h2>
      <ul>
        <li><Link href="/guards">Manage Guards</Link></li>
        <li><Link href="/shifts">Manage Shifts</Link></li>
      </ul>
    </div>
  );
}
