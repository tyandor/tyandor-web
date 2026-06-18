import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Metadata } from 'next'
import { CategoryTagDisplay } from '@/app/components/CategoryTagDisplay'
import ContentNavigation from '@/app/components/ContentNavigation'

interface Idea {
  id: string;
  title: string;
  date: string;
}


export async function generateStaticParams() {
  const ideasDirectory = path.join(process.cwd(), 'ideas')
  const fileNames = fs.readdirSync(ideasDirectory)

  return fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .filter(fileName => {
      const { data } = matter(fs.readFileSync(path.join(ideasDirectory, fileName), 'utf8'))
      return data.draft !== true
    })
    .map((fileName) => ({
      id: fileName.replace(/\.mdx$/, ''),
    }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const fullPath = path.join(process.cwd(), 'ideas', `${id}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data } = matter(fileContents)

  return {
    title: `Idea: ${data.title}`,
    description: data.summary || `Explore this innovative idea: ${data.title}`,
    openGraph: {
      title: `Idea: ${data.title}`,
      description: data.summary || `Explore this innovative idea: ${data.title}`,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: `Idea: ${data.title}`,
      description: data.summary || `Explore this innovative idea: ${data.title}`,
    },
  }
}

export default async function Idea({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const fullPath = path.join(process.cwd(), 'ideas', `${id}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl md:text-3xl font-bold font-mono mb-4">{data.title}</h1>
      <p className="text-gray-600 italic mb-6">{data.summary}</p>
      <div className="prose max-w-none">
        <MDXRemote source={content} />
      </div>
      <CategoryTagDisplay
        categories={data.categories}
        tags={data.tags}
        className="mt-8"
      />
      <ContentNavigation
        currentSlug={id}
        contentType="ideas"
        contentDirectory="ideas"
        allContentHref="/ideas"
        allContentLabel="All Ideas"
      />
    </div>
  )
}

