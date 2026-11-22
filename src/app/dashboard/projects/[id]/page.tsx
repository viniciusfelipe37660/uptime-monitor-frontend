'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { apiFetch, ApiError } from '@/lib/api';
import type { Monitor, Project } from '@/lib/types';

const INTERVAL_OPTIONS = [
  { label: '1 minuto', value: 60 },
  { label: '5 minutos', value: 300 },
  { label: '15 minutos', value: 900 },
];

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [intervalSeconds, setIntervalSeconds] = useState(300);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    apiFetch<Project>(`/projects/${id}`).then(setProject).catch(() => {});
    apiFetch<Monitor[]>(`/projects/${id}/monitors`)
      .then(setMonitors)
      .catch(() => {});
  }, [user, id]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const monitor = await apiFetch<Monitor>(`/projects/${id}/monitors`, {
        method: 'POST',
        body: JSON.stringify({ name, url, intervalSeconds }),
      });
      setMonitors((prev) => [...prev, monitor]);
      setName('');
      setUrl('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Falha ao criar monitor');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-700">
        ← Projetos
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
        {project?.name ?? '...'}
      </h1>
      {project && (
        <p className="mt-1 text-sm text-zinc-500">
          Status público:{' '}
          <Link href={`/status/${project.slug}`} className="underline">
            /status/{project.slug}
          </Link>
        </p>
      )}

      <ul className="mt-6 flex flex-col gap-2">
        {monitors.map((m) => (
          <li key={m.id}>
            <Link
              href={`/dashboard/monitors/${m.id}`}
              className="flex items-center justify-between rounded border border-zinc-200 bg-white px-4 py-3 hover:border-zinc-400"
            >
              <div>
                <span className="font-medium text-zinc-900">{m.name}</span>
                <span className="ml-2 text-sm text-zinc-500">{m.url}</span>
              </div>
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  m.isActive ? 'bg-emerald-500' : 'bg-zinc-300'
                }`}
              />
            </Link>
          </li>
        ))}
        {monitors.length === 0 && (
          <p className="text-sm text-zinc-500">Nenhum monitor ainda.</p>
        )}
      </ul>

      <form
        onSubmit={handleCreate}
        className="mt-8 flex flex-col gap-3 rounded border border-zinc-200 bg-white p-4"
      >
        <h2 className="font-medium text-zinc-900">Novo monitor</h2>
        <input
          required
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded border border-zinc-300 px-3 py-2"
        />
        <input
          required
          type="url"
          placeholder="https://exemplo.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="rounded border border-zinc-300 px-3 py-2"
        />
        <select
          value={intervalSeconds}
          onChange={(e) => setIntervalSeconds(Number(e.target.value))}
          className="rounded border border-zinc-300 px-3 py-2"
        >
          {INTERVAL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="self-start rounded bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          Criar
        </button>
      </form>
    </div>
  );
}
