import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'

const AnimatedArticleCard = dynamic(() => import('../components/AnimatedArticleCard'), { ssr: false })

export const metadata: Metadata = {
  title: 'Articles',
  description: 'In-depth articles on various topics',
  openGraph: {
    title: 'Articles',
    description: 'In-depth articles on various topics',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Articles',
    description: 'In-depth articles on various topics',
  },
}

export default function ArticlesPage() {
  const articlesDirectory = path.join(process.cwd(), 'articles')
  const fileNames = fs.readdirSync(articlesDirectory)

  const articles = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(articlesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug: fileName.replace(/\.mdx$/, ''),
        title: data.title,
        description: data.description,
        date: data.date,
        author: data.author,
        draft: data.draft,
      }
    })
    .filter(article => article.draft !== true)

  articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-7xl font-bold font-mono mb-8 text-rosePine-rose">Articles</h1>
      <div className="space-y-8">
        {articles.map((article) => (
          <AnimatedArticleCard
            key={article.slug}
            slug={article.slug}
            title={article.title}
            description={article.description}
            date={article.date}
            author={article.author}
          />
        ))}
      </div>
    </div>
  )
}

