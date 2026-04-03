import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse all content organized by categories across articles, quotes, ideas, projects, tools, designs, and books',
  openGraph: {
    title: 'Categories',
    description: 'Browse all content organized by categories across articles, quotes, ideas, projects, tools, designs, and books',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Categories',
    description: 'Browse all content organized by categories across articles, quotes, ideas, projects, tools, designs, and books',
  },
}

interface ContentItem {
  slug: string
  title: string
  date: string
  type: string
  author?: string
}

interface CategoryData {
  name: string
  items: ContentItem[]
}

interface ContentByType {
  [key: string]: CategoryData[]
}

function getAllCategoriesAndContent(): ContentByType {
  const contentTypes = [
    { type: 'articles', categoryField: 'categories' },
    { type: 'quotes', categoryField: 'categories' },
    { type: 'ideas', categoryField: 'categories' },
    { type: 'projects', categoryField: 'technologies' },
    { type: 'tools', categoryField: 'category' },
    { type: 'designs', categoryField: 'category' },
    { type: 'books', categoryField: 'genre' }
  ]

  const contentByType: ContentByType = {}

  contentTypes.forEach(({ type, categoryField }) => {
    const categoryMap = new Map<string, ContentItem[]>()

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

        // Handle different category field types
        if (categoryField === 'categories' && data.categories && Array.isArray(data.categories)) {
          data.categories.forEach((category: string) => {
            if (!categoryMap.has(category)) {
              categoryMap.set(category, [])
            }
            categoryMap.get(category)!.push(contentItem)
          })
        } else if (categoryField === 'category' && data.category) {
          if (!categoryMap.has(data.category)) {
            categoryMap.set(data.category, [])
          }
          categoryMap.get(data.category)!.push(contentItem)
        } else if (categoryField === 'technologies' && data.technologies && Array.isArray(data.technologies)) {
          data.technologies.forEach((tech: string) => {
            if (!categoryMap.has(tech)) {
              categoryMap.set(tech, [])
            }
            categoryMap.get(tech)!.push(contentItem)
          })
        } else if (categoryField === 'genre' && data.genre) {
          if (!categoryMap.has(data.genre)) {
            categoryMap.set(data.genre, [])
          }
          categoryMap.get(data.genre)!.push(contentItem)
        }
      })
    } catch {
      // Directory might not exist, skip
    }

    // Convert map to array and sort
    const categories: CategoryData[] = Array.from(categoryMap.entries()).map(([name, items]) => ({
      name,
      items: items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    })).sort((a, b) => a.name.localeCompare(b.name))

    if (categories.length > 0) {
      contentByType[type] = categories
    }
  })

  return contentByType
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

export default function CategoriesPage() {
  const contentByType = getAllCategoriesAndContent()

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🏷️</div>
        <h1 className="text-4xl font-bold mb-4 text-rosePine-text dark:text-rosePineMoon-text">
          Categories
        </h1>
        <p className="text-lg text-rosePine-subtle dark:text-rosePineMoon-subtle max-w-2xl mx-auto">
          Explore all content organized by categories across articles, quotes, ideas, projects, tools, designs, and books.
        </p>
      </div>

      {Object.keys(contentByType).length === 0 ? (
        <p className="text-center text-rosePine-subtle dark:text-rosePineMoon-subtle">
          No categorized content found.
        </p>
      ) : (
        <div className="space-y-12">
          {Object.entries(contentByType).map(([type, categories]) => (
            <section key={type} className="border border-rosePine-surface dark:border-rosePineMoon-surface rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-rosePine-text dark:text-rosePineMoon-text flex items-center gap-2">
                <span className="text-2xl">{getTypeIcon(type)}</span>
                {getTypeDisplayName(type)}
              </h2>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <div key={`${type}-${category.name}`} className="border border-rosePine-highlight dark:border-rosePineMoon-highlight rounded-lg p-4 hover:border-rosePine-foam dark:hover:border-rosePineMoon-foam transition-colors">
                    <h3 className="text-lg font-semibold mb-3 text-rosePine-text dark:text-rosePineMoon-text">
                      {category.name}
                    </h3>
                    <div className="space-y-2">
                      {category.items.slice(0, 3).map((item) => (
                        <div key={`${item.type}-${item.slug}`}>
                          <Link
                            href={getContentUrl(item)}
                            className="text-sm text-rosePine-text dark:text-rosePineMoon-text hover:text-rosePine-foam dark:hover:text-rosePineMoon-foam transition-colors line-clamp-1"
                          >
                            {item.title}
                          </Link>
                          <div className="text-xs text-rosePine-subtle dark:text-rosePineMoon-subtle">
                            {item.author && <span>by {item.author} • </span>}
                            {item.date && new Date(item.date).toISOString().split('T')[0]}
                          </div>
                        </div>
                      ))}
                      {category.items.length > 3 && (
                        <Link
                          href={`/category/${category.name.toLowerCase()}`}
                          className="text-xs text-rosePine-foam dark:text-rosePineMoon-foam hover:underline"
                        >
                          View all {category.items.length} items →
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