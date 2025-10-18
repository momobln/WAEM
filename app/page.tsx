import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>YourShift App</h1>
      <p>Go to <Link href="/login">Login</Link> or <Link href="/shifts">Shifts</Link></p>
    </div>
  );
}
