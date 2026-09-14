'use client';

import { useState, type ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ApiErrorBody {
  error?: { code?: string; message?: string };
}

export default function LoginPage(): ReactElement {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as ApiErrorBody | null;
        setError(data?.error?.message ?? 'Login failed');
        return;
      }
      router.push('/upload');
    } catch {
      setError('Network error, please try again');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="eyebrow mb-2">Welcome back</p>
          <h1 className="font-display text-4xl font-semibold tracking-tight">Log in</h1>
          <p className="mt-2 text-muted-foreground">
            Continue finding the hairstyle that suits you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full h-11 text-base">
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <button type="button" className="btn-outline w-full">
          Continue with Google
        </button>
        <button type="button" className="btn-outline w-full mt-2">
          Continue with GitHub
        </button>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          No account?{' '}
          <Link href="/auth/register" className="text-accent font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
