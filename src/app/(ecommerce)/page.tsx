import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24 h-full">
      <h1 className="text-5xl">This is the Home Page</h1>
      <Link href="/dashboard">Ir al panel de administrador</Link>
    </main>
  );
}
