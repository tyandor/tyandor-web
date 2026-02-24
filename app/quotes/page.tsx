import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Metadata } from 'next'
import AnimatedQuoteCard from '../components/AnimatedQuoteCard'

export const metadata: Metadata = {
  title: 'Quotes',
  description: 'A collection of inspiring quotes',
  openGraph: {
    title: 'Quotes',
    description: 'A collection of inspiring quotes',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Quotes',
    description: 'A collection of inspiring quotes',
  },
}

export default function QuotesPage() {
  const quotesDirectory = path.join(process.cwd(), 'quotes')
  const fileNames = fs.readdirSync(quotesDirectory)

  const quotes = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(quotesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        id: fileName.replace(/\.mdx$/, ''),
        author: data.author,
        quote: data.quote,
      }
    })

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-7xl font-bold font-mono mb-8 text-rosePine-rose">Quotes</h1>
      <div className="space-y-12">
        {quotes.map((quote) => (
          <AnimatedQuoteCard
            key={quote.id}
            id={quote.id}
            quote={quote.quote}
            author={quote.author}
          />
        ))}
      </div>
    </div>
  )
}

