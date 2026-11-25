import { notFound } from 'next/navigation';
import type { PublicStatus } from '@/lib/types';

const API_URL = process.env.BACKEND_URL ?? 'http://localhost:3000';

async function getStatus(slug: string): Promise<PublicStatus | null> {
  const res = await fetch(`${API_URL}/status/${slug}`, {
    next: { revalidate: 30 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to load status');
  return res.json();
}

export default async function StatusPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const status = await getStatus(slug);
  if (!status) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900">{status.name}</h1>
      <p className="text-sm text-zinc-500">Status dos serviços</p>

      <ul className="mt-8 flex flex-col gap-4">
        {status.monitors.map((monitor) => {
          const recent = monitor.checks.slice(0, 90);
          const isUpNow = recent[0]?.isUp ?? true;
          const uptimePercent =
            recent.length === 0
              ? 100
              : (recent.filter((c) => c.isUp).length / recent.length) * 100;

          return (
            <li
              key={monitor.id}
              className="rounded border border-zinc-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-900">{monitor.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    isUpNow
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {isUpNow ? 'Operacional' : 'Indisponível'}
                </span>
              </div>
              <div className="mt-2 flex gap-0.5">
                {[...recent].reverse().map((c, i) => (
                  <div
                    key={i}
                    title={new Date(c.checkedAt).toLocaleString('pt-BR')}
                    className={`h-6 flex-1 rounded-sm ${
                      c.isUp ? 'bg-emerald-400' : 'bg-red-400'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                {uptimePercent.toFixed(2)}% de uptime
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
