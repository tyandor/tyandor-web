import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { Metadata } from 'next'
// import { useState } from 'react' //Removed as per update 1
import { compareDesc } from 'date-fns'
import { Counter } from '@/app/components/Counter'

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
      authors: [data.author || 'Blog Author'],
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

interface Article {
  slug: string;
  title: string;
  date: string;
}

function getAdjacentArticles(currentSlug: string): { prev: Article | null; next: Article | null } {
  const articlesDirectory = path.join(process.cwd(), 'articles')
  const fileNames = fs.readdirSync(articlesDirectory)

  const articles: Article[] = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(articlesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug: fileName.replace(/\.mdx$/, ''),
        title: data.title,
        date: data.date,
      }
    })

  articles.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  const currentIndex = articles.findIndex(article => article.slug === currentSlug)

  return {
    prev: currentIndex > 0 ? articles[currentIndex - 1] : null,
    next: currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null,
  }
}

export default async function Article({ params }: { params: { slug: string } }) {
  const fullPath = path.join(process.cwd(), 'articles', `${params.slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const { prev, next } = getAdjacentArticles(params.slug)

  return (
    <>
      <div className="text-center">
        <h1 className="text-7xl font-bold mb-4">{data.title}</h1>
        <p className="text-gray-500 mb-2">By {data.author} on {new Date(data.date).toLocaleDateString()}</p>
      </div>
      <div className="max-w-4xl mx-auto p-4">
        <div className="prose max-w-none mt-10">
          <MDXRemote source={content} components={components} />
        </div>
        <div className="mt-8 flex justify-between">
          {prev && (
            <Link href={`/articles/${prev.slug}`} className="text-rosePine-foam dark:text-rosePineMoon-foam hover:text-rosePine-pine dark:hover:text-rosePineMoon-pine transition-colors">
              ← {prev.title}
            </Link>
          )}
          {next && (
            <Link href={`/articles/${next.slug}`} className="text-rosePine-foam dark:text-rosePineMoon-foam hover:text-rosePine-pine dark:hover:text-rosePineMoon-pine transition-colors">
              {next.title} →
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

