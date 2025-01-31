import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { Metadata } from 'next'
import { compareDesc } from 'date-fns'
import dynamic from 'next/dynamic'

const AnimatedQuote = dynamic(() => import('../../components/AnimatedQuote'), { ssr: false })

interface Quote {
  id: string;
  author: string;
  date: string;
}

function getAdjacentQuotes(currentId: string): { prev: Quote | null; next: Quote | null } {
  const quotesDirectory = path.join(process.cwd(), 'quotes')
  const fileNames = fs.readdirSync(quotesDirectory)

  const quotes: Quote[] = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(quotesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        id: fileName.replace(/\.mdx$/, ''),
        author: data.author,
        date: data.date,
      }
    })

  quotes.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  const currentIndex = quotes.findIndex(quote => quote.id === currentId)

  return {
    prev: currentIndex > 0 ? quotes[currentIndex - 1] : null,
    next: currentIndex < quotes.length - 1 ? quotes[currentIndex + 1] : null,
  }
}

export async function generateStaticParams() {
  const quotesDirectory = path.join(process.cwd(), 'quotes')
  const fileNames = fs.readdirSync(quotesDirectory)

  return fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => ({
      id: fileName.replace(/\.mdx$/, ''),
    }))
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const fullPath = path.join(process.cwd(), 'quotes', `${params.id}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data } = matter(fileContents)

  return {
    title: `Quote: ${data.author}`,
    description: data.quote.substring(0, 160),
    openGraph: {
      title: `Quote by ${data.author}`,
      description: data.quote.substring(0, 160),
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: `Quote by ${data.author}`,
      description: data.quote.substring(0, 160),
    },
  }
}

export default async function Quote({ params }: { params: { id: string } }) {
  const fullPath = path.join(process.cwd(), 'quotes', `${params.id}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const { prev, next } = getAdjacentQuotes(params.id)

  return (
    <div className="max-w-5xl mx-auto p-4">
      <AnimatedQuote
        key={params.id}
        quote={data.quote}
        author={data.author}
        content={<MDXRemote source={content} />}
      />
      <div className="mt-16 flex justify-between">
        {prev && (
          <Link href={`/quotes/${prev.id}`} className="text-rosePine-foam dark:text-rosePineDawn-foam hover:text-rosePine-pine dark:hover:text-rosePineDawn-pine transition-colors">
            ← {prev.author}
          </Link>
        )}
        <Link href="/quotes" className="text-blue-500 hover:underline">
          All quotes
        </Link>
        {next && (
          <Link href={`/quotes/${next.id}`} className="text-rosePine-foam dark:text-rosePineDawn-foam hover:text-rosePine-pine dark:hover:text-rosePineDawn-pine transition-colors">
            {next.author} →
          </Link>
        )}
      </div>
    </div>
  )
}

