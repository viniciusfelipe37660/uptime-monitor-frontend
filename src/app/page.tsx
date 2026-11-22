import Link from 'next/link';

export default function Home() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
        Monitore seus sites e APIs
      </h1>
      <p className="mt-4 text-lg text-zinc-600">
        Checagens periódicas, histórico de incidentes e uma página pública de
        status para compartilhar com seus usuários.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/register"
          className="rounded bg-zinc-900 px-5 py-2.5 text-white hover:bg-zinc-700"
        >
          Começar agora
        </Link>
        <Link
          href="/login"
          className="rounded border border-zinc-300 px-5 py-2.5 text-zinc-900 hover:bg-zinc-100"
        >
          Entrar
        </Link>
      </div>
    </div>
  );
}
