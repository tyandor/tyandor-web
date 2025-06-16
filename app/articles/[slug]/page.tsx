import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { Metadata } from 'next'
import { compareDesc } from 'date-fns'
import { Counter } from '@/app/components/Counter'
import { CategoryTagDisplay } from '@/app/components/CategoryTagDisplay'
import ContentNavigation from '@/components/ContentNavigation'
import remarkGfm from 'remark-gfm'

export async function generateStaticParams() {
  const articlesDirectory = path.join(process.cwd(), 'articles')
  const fileNames = fs.readdirSync(articlesDirectory)

  return fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => ({
      slug: fileName.replace(/\.mdx$/, ''),
    }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const fullPath = path.join(process.cwd(), 'articles', `${params.slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data } = matter(fileContents)

  return {
    title: data.title,
    description: data.description || `Read the full article: ${data.title}`,
    openGraph: {
      title: data.title,
      description: data.description || `Read the full article: ${data.title}`,
      type: 'article',
      publishedTime: data.date,
      authors: [data.author || 'Tyler Andor'],
      tags: data.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description || `Read the full article: ${data.title}`,
    },
  }
}

const components = {
  Counter: Counter, //Updated as per update 2
}


export default async function Article({ params }: { params: { slug: string } }) {
  const fullPath = path.join(process.cwd(), 'articles', `${params.slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return (
    <article className="mt-14">
      <div className="text-center">
        <h1 className="text-8xl font-bold mb-4">{data.title}</h1>
        <p className="text-gray-500 mt-8 font-serif">Published {new Date(data.date).toLocaleDateString()}</p>
        <p className="text-2xl mt-6 text-rosePineMoon-muted dark:text-rosePine-muted">&sect;</p>
      </div>
      <div className="max-w-4xl mx-auto p-4">
        <div className="prose text-rosePine-text dark:prose-rosePine-text max-w-none mt-10">
          <MDXRemote 
            source={content} 
            components={components}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
          />
        </div>
      </div>
      <CategoryTagDisplay 
        categories={data.categories} 
        tags={data.tags} 
        className="justify-center mt-8" 
      />
      <ContentNavigation
        currentSlug={params.slug}
        contentType="articles"
        contentDirectory="articles"
        allContentHref="/articles"
        allContentLabel="All Articles"
      />
    </article>
  )
}

