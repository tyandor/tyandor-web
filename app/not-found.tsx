import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-rosePine-base text-rosePine-text">
      <h1 className="text-4xl font-bold mb-4 text-rosePine-rose">404 - Page Not Found</h1>
      <p className="text-rosePine-muted mb-8">Oops! The page you're looking for doesn't exist.</p>
      <Link href="/" className="px-4 py-2 bg-rosePine-pine text-rosePine-text rounded hover:bg-rosePine-foam transition-colors">
        Go back home
      </Link>
    </div>
  )
}

