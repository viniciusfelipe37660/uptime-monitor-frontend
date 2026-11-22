'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { apiFetch, ApiError } from '@/lib/api';
import type { Project } from '@/lib/types';

const SLUG_PATTERN = /^[a-z0-9-]{3,50}$/;

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      apiFetch<Project[]>('/projects').then(setProjects).catch(() => {});
    }
  }, [user]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!SLUG_PATTERN.test(slug)) {
      setError('Slug deve ter 3-50 caracteres: letras minúsculas, números e hífens');
      return;
    }

    setSubmitting(true);
    try {
      const project = await apiFetch<Project>('/projects', {
        method: 'POST',
        body: JSON.stringify({ name, slug }),
      });
      setProjects((prev) => [...prev, project]);
      setName('');
      setSlug('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Falha ao criar projeto');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900">Seus projetos</h1>

      <ul className="mt-6 flex flex-col gap-2">
        {projects.map((p) => (
          <li key={p.id}>
            <Link
              href={`/dashboard/projects/${p.id}`}
              className="block rounded border border-zinc-200 bg-white px-4 py-3 hover:border-zinc-400"
            >
              <span className="font-medium text-zinc-900">{p.name}</span>
              <span className="ml-2 text-sm text-zinc-500">/{p.slug}</span>
            </Link>
          </li>
        ))}
        {projects.length === 0 && (
          <p className="text-sm text-zinc-500">Nenhum projeto ainda.</p>
        )}
      </ul>

      <form
        onSubmit={handleCreate}
        className="mt-8 flex flex-col gap-3 rounded border border-zinc-200 bg-white p-4"
      >
        <h2 className="font-medium text-zinc-900">Novo projeto</h2>
        <input
          required
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded border border-zinc-300 px-3 py-2"
        />
        <input
          required
          placeholder="slug-para-url-publica"
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase())}
          className="rounded border border-zinc-300 px-3 py-2"
        />
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
