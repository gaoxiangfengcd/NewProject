'use client';

import { useState, type ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ApiErrorBody {
  error?: { code?: string; message?: string };
}

export default function RegisterPage(): ReactElement {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload: Record<string, string> = { email, password };
      if (name.trim()) payload.name = name.trim();
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as ApiErrorBody | null;
        setError(data?.error?.message ?? 'Registration failed');
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
          <p className="eyebrow mb-2">Get started</p>
          <h1 className="font-display text-4xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-2 text-muted-foreground">
            See how different hairstyles look on you — before you cut.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">
              Name <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </div>
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
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="input"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full h-11 text-base">
            {submitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-accent font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
