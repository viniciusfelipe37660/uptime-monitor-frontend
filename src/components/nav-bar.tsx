'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export function NavBar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold text-zinc-900">
          Uptime Monitor
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {!loading && user && (
            <>
              <Link href="/dashboard" className="text-zinc-600 hover:text-zinc-900">
                Dashboard
              </Link>
              <span className="text-zinc-400">{user.email}</span>
              <button
                onClick={handleLogout}
                className="rounded bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-700"
              >
                Sair
              </button>
            </>
          )}
          {!loading && !user && (
            <>
              <Link href="/login" className="text-zinc-600 hover:text-zinc-900">
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-700"
              >
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
