'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api';
import type { Check, Incident } from '@/lib/types';

export default function MonitorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checks, setChecks] = useState<Check[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    apiFetch<Check[]>(`/monitors/${id}/checks`).then(setChecks).catch(() => {});
    apiFetch<Incident[]>(`/monitors/${id}/incidents`)
      .then(setIncidents)
      .catch(() => {});
  }, [user, id]);

  if (loading || !user) return null;

  const chartData = [...checks]
    .reverse()
    .map((c) => ({
      time: new Date(c.checkedAt).toLocaleTimeString('pt-BR'),
      ms: c.responseTimeMs ?? 0,
    }));

  const uptimePercent =
    checks.length === 0
      ? null
      : ((checks.filter((c) => c.isUp).length / checks.length) * 100).toFixed(1);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900">Histórico do monitor</h1>
      {uptimePercent && (
        <p className="mt-1 text-sm text-zinc-500">
          Uptime (últimas {checks.length} checagens): {uptimePercent}%
        </p>
      )}

      <div className="mt-6 h-64 rounded border border-zinc-200 bg-white p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="time" hide />
            <YAxis width={40} />
            <Tooltip />
            <Line type="monotone" dataKey="ms" stroke="#18181b" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h2 className="mt-8 font-medium text-zinc-900">Incidentes</h2>
      <ul className="mt-2 flex flex-col gap-2">
        {incidents.map((inc) => (
          <li
            key={inc.id}
            className="rounded border border-zinc-200 bg-white px-4 py-3 text-sm"
          >
            <span className="font-medium">
              {new Date(inc.startedAt).toLocaleString('pt-BR')}
            </span>
            {' — '}
            {inc.resolvedAt
              ? `resolvido em ${new Date(inc.resolvedAt).toLocaleString('pt-BR')}`
              : 'em aberto'}
            {inc.cause && (
              <p className="mt-1 text-zinc-500">{inc.cause}</p>
            )}
          </li>
        ))}
        {incidents.length === 0 && (
          <p className="text-sm text-zinc-500">Nenhum incidente registrado.</p>
        )}
      </ul>
    </div>
  );
}
