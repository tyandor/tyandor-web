import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import { Metadata } from 'next'

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'posts')
  const fileNames = fs.readdirSync(postsDirectory)

  const categories = new Set<string>()
  fileNames.forEach((fileName) => {
    if (fileName.endsWith('.md') || fileName.endsWith('.mdx')) {
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)
      if (data.category) {
        categories.add(data.category.toLowerCase().replace(/ /g, '-'))
      }
    }
  })

  return Array.from(categories).map((category) => ({
    category: category,
  }))
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const categoryName = params.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  return {
    title: `Posts in category: ${categoryName}`,
    description: `Browse all blog posts in the ${categoryName} category`,
    openGraph: {
      title: `Posts in category: ${categoryName}`,
      description: `Browse all blog posts in the ${categoryName} category`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `Posts in category: ${categoryName}`,
      description: `Browse all blog posts in the ${categoryName} category`,
    },
  }
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const postsDirectory = path.join(process.cwd(), 'posts')
  const fileNames = fs.readdirSync(postsDirectory)
  
  const posts = fileNames
    .map((fileName) => {
      if (!fileName.endsWith('.md') && !fileName.endsWith('.mdx')) return null

      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)
      
      if (data.category && data.category.toLowerCase().replace(/ /g, '-') === params.category) {
        return {
          slug: fileName.replace(/\.(md|mdx)$/, ''),
          title: data.title,
          date: data.date,
        }
      }
      return null
    })
    .filter(Boolean)

  posts.sort((a, b) => a.date < b.date ? 1 : -1)

  const categoryName = params.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Posts in category: {categoryName}</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug} className="border p-4 rounded-md">
            <Link href={`/posts/${post.slug}`} className="text-xl font-semibold hover:underline">
              {post.title}
            </Link>
            <p className="text-gray-500 mt-1">{new Date(post.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

