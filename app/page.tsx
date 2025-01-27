import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import dynamic from 'next/dynamic'

const AnimatedHomeArticleCard = dynamic(() => import('./components/AnimatedHomeArticleCard'), { ssr: false })
const AnimatedHomeQuote = dynamic(() => import('./components/AnimatedHomeQuote'), { ssr: false })
const AnimatedHomeToolCard = dynamic(() => import('./components/AnimatedHomeToolCard'), { ssr: false })
const AnimatedHomeDesignCard = dynamic(() => import('./components/AnimatedHomeDesignCard'), { ssr: false })

interface Article {
  slug: string
  title: string
  date: string
  description: string
  author: string
}

interface Quote {
  slug: string
  author: string
  quote: string
}

interface Tool {
  slug: string
  title: string
  description: string
  category: string
  image: string
}

interface Design {
  slug: string
  title: string
  description: string
  image: string
}

function getRandomQuote(): Quote | null {
  const quotesDirectory = path.join(process.cwd(), 'quotes')
  const quoteFiles = fs.readdirSync(quotesDirectory)

  if (quoteFiles.length === 0) {
    return null
  }

  const randomFile = quoteFiles[Math.floor(Math.random() * quoteFiles.length)]
  const fullPath = path.join(quotesDirectory, randomFile)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data } = matter(fileContents)

  return {
    slug: randomFile.replace(/\.mdx$/, ''),
    author: data.author,
    quote: data.quote,
  }
}

function getRecentTools(): Tool[] {
  const toolsDirectory = path.join(process.cwd(), 'tools')
  const fileNames = fs.readdirSync(toolsDirectory)

  const tools = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(toolsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug: fileName.replace(/\.mdx$/, ''),
        title: data.title,
        description: data.description,
        category: data.category,
        image: data.image || '/placeholder.svg?height=400&width=600',
      }
    })

  tools.sort((a, b) => b.slug.localeCompare(a.slug))
  return tools.slice(0, 2)
}

function getRecentDesigns(): Design[] {
  const designsDirectory = path.join(process.cwd(), 'designs')
  const fileNames = fs.readdirSync(designsDirectory)

  const designs = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(designsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug: fileName.replace(/\.mdx$/, ''),
        title: data.title,
        description: data.description,
        image: data.image || '/placeholder.svg?height=400&width=600',
      }
    })

  designs.sort((a, b) => b.slug.localeCompare(a.slug))
  return designs.slice(0, 3)
}

export default function Home() {
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
        description: data.description,
        author: data.author,
      }
    })

  articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const recentArticles = articles.slice(0, 3)
  const randomQuote = getRandomQuote()
  const recentTools = getRecentTools()
  const recentDesigns = getRecentDesigns()

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 gap-4 mb-12 articles-section"> {/* Added articles-section class */}
          <h2 className="text-2xl mb-0 font-bold text-rosePine-rose dark:text-rosePineMoon-rose">// articles</h2>
          {recentArticles.map((article) => (
            <AnimatedHomeArticleCard
              key={article.slug}
              slug={article.slug}
              title={article.title}
              description={article.description}
            />
          ))}
        </div>
      </div>
      <div className="max-w-7xl py-8 mx-auto">
        {randomQuote && (
          <AnimatedHomeQuote
            quote={randomQuote.quote}
            author={randomQuote.author}
            slug={randomQuote.slug}
          />
        )}
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="mt-12 mb-12">
          <h2 className="text-2xl mb-4 font-bold text-rosePine-rose dark:text-rosePineMoon-rose">// recent tools</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {recentTools.map((tool) => (
              <AnimatedHomeToolCard
                key={tool.slug}
                slug={tool.slug}
                title={tool.title}
                description={tool.description}
                category={tool.category}
                image={tool.image}
              />
            ))}
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl mb-4 font-bold text-rosePine-rose dark:text-rosePineMoon-rose">// recent designs</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {recentDesigns.map((design) => (
              <AnimatedHomeDesignCard
                key={design.slug}
                slug={design.slug}
                title={design.title}
                description={design.description}
                image={design.image}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

