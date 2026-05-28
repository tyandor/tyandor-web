import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { CategoryTagDisplay } from '@/app/components/CategoryTagDisplay'
import ContentNavigation from '@/components/ContentNavigation'

const AnimatedQuote = dynamic(() => import('../../components/AnimatedQuote'), { ssr: false })

interface Quote {
  id: string;
  slug: string;
  author: string;
  date: string;
}


export async function generateStaticParams() {
  const quotesDirectory = path.join(process.cwd(), 'quotes')
  const fileNames = fs.readdirSync(quotesDirectory)

  return fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .filter(fileName => {
      const { data } = matter(fs.readFileSync(path.join(quotesDirectory, fileName), 'utf8'))
      return data.draft !== true
    })
    .map((fileName) => ({
      id: fileName.replace(/\.mdx$/, ''),
      slug: fileName.replace(/\.mdx$/, ''),
    }))
}

export async function generateMetadata({ params }: { params: { id: string, slug: string } }): Promise<Metadata> {
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

export default async function Quote({ params }: { params: { id: string, slug: string } }) {
  const fullPath = path.join(process.cwd(), 'quotes', `${params.id}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return (
    <div className="max-w-5xl mx-auto p-4">
      <AnimatedQuote
        key={params.id}
        quote={data.quote}
        author={data.author}
        content={<MDXRemote source={content} />}
      />
      <CategoryTagDisplay
        categories={data.categories}
        tags={data.tags}
        className="mt-8"
      />
      <ContentNavigation
        currentSlug={params.id}
        contentType="quotes"
        contentDirectory="quotes"
        allContentHref="/quotes"
        allContentLabel="All Quotes"
      />
    </div>
  )
}

