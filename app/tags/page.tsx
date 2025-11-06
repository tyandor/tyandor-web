import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Browse all content organized by tags across articles, quotes, ideas, projects, tools, designs, and books',
  openGraph: {
    title: 'Tags',
    description: 'Browse all content organized by tags across articles, quotes, ideas, projects, tools, designs, and books',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tags',
    description: 'Browse all content organized by tags across articles, quotes, ideas, projects, tools, designs, and books',
  },
}

interface ContentItem {
  slug: string
  title: string
  date: string
  type: string
  author?: string
}

interface TagData {
  name: string
  items: ContentItem[]
}

interface ContentByType {
  [key: string]: TagData[]
}

function getAllTagsAndContent(): ContentByType {
  const contentTypes = ['articles', 'quotes', 'ideas', 'projects', 'tools', 'designs', 'books']
  const contentByType: ContentByType = {}

  contentTypes.forEach((type) => {
    const tagMap = new Map<string, ContentItem[]>()

    try {
      const directory = path.join(process.cwd(), type)
      const fileNames = fs.readdirSync(directory)

      fileNames.forEach((fileName) => {
        if (!fileName.endsWith('.md') && !fileName.endsWith('.mdx')) return

        const fullPath = path.join(directory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data } = matter(fileContents)

        const slug = fileName.replace(/\.(md|mdx)$/, '')
        const contentItem: ContentItem = {
          slug,
          title: data.title || slug,
          date: data.date,
          type,
          author: data.author
        }

        // Handle tags field
        if (data.tags && Array.isArray(data.tags)) {
          data.tags.forEach((tag: string) => {
            if (!tagMap.has(tag)) {
              tagMap.set(tag, [])
            }
            tagMap.get(tag)!.push(contentItem)
          })
        }
      })
    } catch (error) {
      // Directory might not exist, skip
    }

    // Convert map to array and sort
    const tags: TagData[] = Array.from(tagMap.entries()).map(([name, items]) => ({
      name,
      items: items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    })).sort((a, b) => a.name.localeCompare(b.name))

    if (tags.length > 0) {
      contentByType[type] = tags
    }
  })

  return contentByType
}

// Get all unique tags across all content types for the tag cloud
function getAllUniqueTags(): TagData[] {
  const allTagsMap = new Map<string, ContentItem[]>()
  const contentTypes = ['articles', 'quotes', 'ideas', 'projects', 'tools', 'designs', 'books']

  contentTypes.forEach((type) => {
    try {
      const directory = path.join(process.cwd(), type)
      const fileNames = fs.readdirSync(directory)

      fileNames.forEach((fileName) => {
        if (!fileName.endsWith('.md') && !fileName.endsWith('.mdx')) return

        const fullPath = path.join(directory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data } = matter(fileContents)

        if (data.tags && Array.isArray(data.tags)) {
          const slug = fileName.replace(/\.(md|mdx)$/, '')
          const contentItem: ContentItem = {
            slug,
            title: data.title || slug,
            date: data.date,
            type,
            author: data.author
          }

          data.tags.forEach((tag: string) => {
            if (!allTagsMap.has(tag)) {
              allTagsMap.set(tag, [])
            }
            allTagsMap.get(tag)!.push(contentItem)
          })
        }
      })
    } catch (error) {
      // Directory might not exist, skip
    }
  })

  return Array.from(allTagsMap.entries()).map(([name, items]) => ({
    name,
    items: items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  })).sort((a, b) => a.name.localeCompare(b.name))
}

const getContentUrl = (item: ContentItem) => {
  return `/${item.type}/${item.slug}`
}

const getTypeDisplayName = (type: string) => {
  const displayNames: { [key: string]: string } = {
    'articles': 'Articles',
    'quotes': 'Quotes',
    'ideas': 'Ideas',
    'projects': 'Projects',
    'tools': 'Tools',
    'designs': 'Designs',
    'books': 'Books'
  }
  return displayNames[type] || type
}

const getTypeIcon = (type: string) => {
  const icons: { [key: string]: string } = {
    'articles': '📝',
    'quotes': '💭',
    'ideas': '💡',
    'projects': '🚀',
    'tools': '🔧',
    'designs': '🎨',
    'books': '📚'
  }
  return icons[type] || '📄'
}

const getTagSize = (itemCount: number, maxCount: number) => {
  const ratio = itemCount / maxCount
  if (ratio > 0.8) return 'text-xl'
  if (ratio > 0.6) return 'text-lg'
  if (ratio > 0.4) return 'text-base'
  if (ratio > 0.2) return 'text-sm'
  return 'text-xs'
}

export default function TagsPage() {
  const contentByType = getAllTagsAndContent()
  const allTags = getAllUniqueTags()
  const maxTagCount = Math.max(...allTags.map(tag => tag.items.length), 1)

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🏷️</div>
        <h1 className="text-4xl font-bold mb-4 text-rosePine-text dark:text-rosePineMoon-text">
          Tags
        </h1>
        <p className="text-lg text-rosePine-subtle dark:text-rosePineMoon-subtle max-w-2xl mx-auto">
          Explore all content organized by tags across articles, quotes, ideas, projects, tools, designs, and books.
        </p>
      </div>

      {allTags.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-rosePine-text dark:text-rosePineMoon-text">
            All Tags
          </h2>
          <div className="border border-rosePine-surface dark:border-rosePineMoon-surface rounded-lg p-6">
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Link
                  key={tag.name}
                  href={`/tag/${tag.name.toLowerCase()}`}
                  className={`inline-block px-3 py-1 bg-rosePine-surface dark:bg-rosePineMoon-surface text-rosePine-text dark:text-rosePineMoon-text hover:bg-rosePine-foam dark:hover:bg-rosePineMoon-foam hover:text-rosePine-base dark:hover:text-rosePineMoon-base rounded-full transition-colors ${getTagSize(tag.items.length, maxTagCount)}`}
                >
                  #{tag.name} ({tag.items.length})
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {Object.keys(contentByType).length === 0 ? (
        <p className="text-center text-rosePine-subtle dark:text-rosePineMoon-subtle">
          No tagged content found.
        </p>
      ) : (
        <div className="space-y-12">
          {Object.entries(contentByType).map(([type, tags]) => (
            <section key={type} className="border border-rosePine-surface dark:border-rosePineMoon-surface rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-rosePine-text dark:text-rosePineMoon-text flex items-center gap-2">
                <span className="text-2xl">{getTypeIcon(type)}</span>
                {getTypeDisplayName(type)}
              </h2>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tags.map((tag) => (
                  <div key={`${type}-${tag.name}`} className="border border-rosePine-highlight dark:border-rosePineMoon-highlight rounded-lg p-4 hover:border-rosePine-foam dark:hover:border-rosePineMoon-foam transition-colors">
                    <h3 className="text-lg font-semibold mb-3 text-rosePine-text dark:text-rosePineMoon-text">
                      #{tag.name}
                    </h3>
                    <div className="space-y-2">
                      {tag.items.slice(0, 3).map((item) => (
                        <div key={`${item.type}-${item.slug}`}>
                          <Link
                            href={getContentUrl(item)}
                            className="text-sm text-rosePine-text dark:text-rosePineMoon-text hover:text-rosePine-foam dark:hover:text-rosePineMoon-foam transition-colors line-clamp-1"
                          >
                            {item.title}
                          </Link>
                          <div className="text-xs text-rosePine-subtle dark:text-rosePineMoon-subtle">
                            {item.author && <span>by {item.author} • </span>}
                            {new Date(item.date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                      {tag.items.length > 3 && (
                        <Link
                          href={`/tag/${tag.name.toLowerCase()}`}
                          className="text-xs text-rosePine-foam dark:text-rosePineMoon-foam hover:underline"
                        >
                          View all {tag.items.length} items →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link href="/" className="text-rosePine-foam dark:text-rosePineMoon-foam hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  )
}