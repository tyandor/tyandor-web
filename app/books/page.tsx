import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'

const AnimatedBookCard = dynamic(() => import('../components/AnimatedBookCard'), { ssr: false })

export const metadata: Metadata = {
  title: 'Books',
  description: 'Explore my collection of book reviews and recommendations',
  openGraph: {
    title: 'Books',
    description: 'Explore my collection of book reviews and recommendations',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Books',
    description: 'Explore my collection of book reviews and recommendations',
  },
}

export default function BooksPage() {
  const booksDirectory = path.join(process.cwd(), 'books')
  const fileNames = fs.readdirSync(booksDirectory)

  const books = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(booksDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug: fileName.replace(/\.mdx$/, ''),
        title: data.title,
        author: data.author,
        description: data.description,
        genre: data.genre,
        image: data.image || '/placeholder.svg?height=400&width=600',
      }
    })

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-7xl font-bold mb-2 text-rosePine-rose">Books</h1>
      <p className="text-2xl mb-8">Notes and reviews</p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <AnimatedBookCard
            key={book.slug}
            slug={book.slug}
            title={book.title}
            author={book.author}
            description={book.description}
            genre={book.genre}
            image={book.image}
          />
        ))}
      </div>
    </div>
  )
}

