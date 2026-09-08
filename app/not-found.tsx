import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text-primary">
      <h1 className="text-4xl font-bold font-mono mb-4 text-text-emphasis">404 - Page Not Found</h1>
      <p className="text-text-placeholder mb-8">Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="px-4 py-2 bg-interactive text-text-on-color rounded hover:bg-interactive-hover transition-colors">
        Go back home
      </Link>
    </div>
  )
}

