import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Metadata } from 'next'
import Image from 'next/image'
import { CategoryTagDisplay } from '@/app/components/CategoryTagDisplay'
import ContentNavigation from '@/components/ContentNavigation'

export async function generateStaticParams() {
  const booksDirectory = path.join(process.cwd(), 'books')
  const fileNames = fs.readdirSync(booksDirectory)

  return fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => ({
      slug: fileName.replace(/\.mdx$/, ''),
    }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const fullPath = path.join(process.cwd(), 'books', `${params.slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data } = matter(fileContents)

  return {
    title: `Book Review: ${data.title}`,
    description: data.description || `Read the review of ${data.title} by ${data.author}`,
    openGraph: {
      title: `Book Review: ${data.title}`,
      description: data.description || `Read the review of ${data.title} by ${data.author}`,
      type: 'article',
      images: [
        {
          url: data.image || '/placeholder.svg?height=600&width=1200',
          width: 1200,
          height: 600,
          alt: data.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Book Review: ${data.title}`,
      description: data.description || `Read the review of ${data.title} by ${data.author}`,
    },
  }
}

export default async function Book({ params }: { params: { slug: string } }) {
  const fullPath = path.join(process.cwd(), 'books', `${params.slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
      <p className="text-xl mb-4">by {data.author}</p>
      {data.image && (
        <div className="mb-6">
          <Image
            src={data.image}
            alt={data.title}
            width={1200}
            height={600}
            className="rounded-lg shadow-md"
          />
        </div>
      )}
      <div className="mb-6">
        <span className="font-semibold">Genre:</span> {data.genre}
        <span className="mx-2">|</span>
        <span className="font-semibold">Rating:</span> {data.rating}/5
      </div>
      <CategoryTagDisplay
        categories={data.categories}
        tags={data.tags}
        className="mb-6"
      />
      <div className="prose max-w-none">
        <MDXRemote source={content} />
      </div>
      <ContentNavigation
        currentSlug={params.slug}
        contentType="books"
        contentDirectory="books"
        allContentHref="/books"
        allContentLabel="All Books"
      />
    </div>
  )
}

