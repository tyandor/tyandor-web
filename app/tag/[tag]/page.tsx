import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import { Metadata } from 'next'

export async function generateStaticParams() {
  const contentTypes = ['articles', 'quotes', 'ideas', 'projects', 'tools', 'designs', 'books']
  const tags = new Set<string>()

  contentTypes.forEach((type) => {
    try {
      const directory = path.join(process.cwd(), type)
      const fileNames = fs.readdirSync(directory)
      
      fileNames.forEach((fileName) => {
        if (fileName.endsWith('.md') || fileName.endsWith('.mdx')) {
          const fullPath = path.join(directory, fileName)
          const fileContents = fs.readFileSync(fullPath, 'utf8')
          const { data } = matter(fileContents)
          if (data.tags && Array.isArray(data.tags)) {
            data.tags.forEach((tag: string) => tags.add(tag.toLowerCase()))
          }
        }
      })
    } catch {
      // Directory might not exist, skip
    }
  })

  return Array.from(tags).map((tag) => ({
    tag: tag,
  }))
}

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  return {
    title: `Items tagged with #${params.tag}`,
    description: `Browse all blog posts tagged with #${params.tag}`,
    openGraph: {
      title: `Items tagged with #${params.tag}`,
      description: `Browse all blog posts tagged with #${params.tag}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `Items tagged with #${params.tag}`,
      description: `Browse all blog posts tagged with #${params.tag}`,
    },
  }
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const contentTypes = ['articles', 'quotes', 'ideas', 'projects', 'tools', 'designs', 'books']
  const allContent: Array<{
    slug: string
    title: string
    date: string
    type: string
    author?: string
  }> = []

  contentTypes.forEach((type) => {
    try {
      const directory = path.join(process.cwd(), type)
      const fileNames = fs.readdirSync(directory)
      
      fileNames.forEach((fileName) => {
        if (!fileName.endsWith('.md') && !fileName.endsWith('.mdx')) return

        const fullPath = path.join(directory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data } = matter(fileContents)

        if (data.tags && Array.isArray(data.tags) && 
            data.tags.some((tag: string) => tag.toLowerCase() === params.tag)) {
          const slug = fileName.replace(/\.(md|mdx)$/, '')
          allContent.push({
            slug,
            title: data.title || slug,
            date: data.date,
            type,
            author: data.author
          })
        }
      })
    } catch {
      // Directory might not exist, skip
    }
  })

  allContent.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const getContentUrl = (item: typeof allContent[0]) => {
    if (item.type === 'quotes' || item.type === 'ideas') {
      return `/${item.type}/${item.slug}`
    }
    return `/${item.type}/${item.slug}`
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-rosePine-text dark:text-rosePineMoon-text">
        Content tagged with #{params.tag}
      </h1>
      {allContent.length === 0 ? (
        <p className="text-rosePine-subtle dark:text-rosePineMoon-subtle">
          No content found with this tag.
        </p>
      ) : (
        <div className="grid gap-6">
          {allContent.map((item) => (
            <div key={`${item.type}-${item.slug}`} className="border border-rosePine-surface dark:border-rosePineMoon-surface p-6 rounded-lg hover:border-rosePine-foam dark:hover:border-rosePineMoon-foam transition-colors">
              <div className="flex items-start justify-between mb-2">
                <Link href={getContentUrl(item)} className="text-xl font-semibold text-rosePine-text dark:text-rosePineMoon-text hover:text-rosePine-foam dark:hover:text-rosePineMoon-foam transition-colors">
                  {item.title}
                </Link>
                <span className="text-xs bg-rosePine-surface dark:bg-rosePineMoon-surface px-2 py-1 rounded-full text-rosePine-subtle dark:text-rosePineMoon-subtle">
                  {item.type}
                </span>
              </div>
              <div className="text-sm text-rosePine-subtle dark:text-rosePineMoon-subtle">
                {item.author && <span>by {item.author} • </span>}
                {new Date(item.date).toISOString().split('T')[0]}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8">
        <Link href="/" className="text-rosePine-foam dark:text-rosePineMoon-foam hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  )
}

