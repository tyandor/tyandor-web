import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Metadata } from 'next'
import { Counter } from '@/app/components/Counter'
import { CategoryTagDisplay } from '@/app/components/CategoryTagDisplay'
import ContentNavigation from '@/app/components/ContentNavigation'
import remarkGfm from 'remark-gfm'

export async function generateStaticParams() {
  const articlesDirectory = path.join(process.cwd(), 'articles')
  const fileNames = fs.readdirSync(articlesDirectory)

  return fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .filter(fileName => {
      const { data } = matter(fs.readFileSync(path.join(articlesDirectory, fileName), 'utf8'))
      return data.draft !== true
    })
    .map((fileName) => ({
      slug: fileName.replace(/\.mdx$/, ''),
    }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const fullPath = path.join(process.cwd(), 'articles', `${slug}.mdx`)
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

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const fullPath = path.join(process.cwd(), 'articles', `${slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return (
    <article className="mt-14">
      <div className="text-center">
        <h1 className="text-5xl md:text-8xl font-bold font-mono leading-[1.4] mb-4">{data.title}</h1>
        <p className="text-gray-500 mt-8 font-serif">
          Published {new Date(data.date).toISOString().split('T')[0]}
          {data.updated && (
            <span> | Updated {new Date(data.updated).toISOString().split('T')[0]}</span>
          )}
        </p>
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
        className="mt-8"
      />
      <ContentNavigation
        currentSlug={slug}
        contentType="articles"
        contentDirectory="articles"
        allContentHref="/articles"
        allContentLabel="All Articles"
      />
    </article>
  )
}

