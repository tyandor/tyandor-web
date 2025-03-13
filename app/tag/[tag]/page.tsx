import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import { Metadata } from 'next'

export async function generateStaticParams() {
  // TODO: add other post types
  const postsDirectory = path.join(process.cwd(), 'articles')
  const fileNames = fs.readdirSync(postsDirectory)

  const tags = new Set<string>()
  fileNames.forEach((fileName) => {
    if (fileName.endsWith('.md') || fileName.endsWith('.mdx')) {
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)
      if (data.tags) {
        data.tags.forEach((tag: string) => tags.add(tag))
      }
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
  const postsDirectory = path.join(process.cwd(), 'articles')
  const fileNames = fs.readdirSync(postsDirectory)

  const posts = fileNames
    .map((fileName) => {
      if (!fileName.endsWith('.md') && !fileName.endsWith('.mdx')) return null

      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      if (data.tags && data.tags.includes(params.tag)) {
        return {
          slug: fileName.replace(/\.(md|mdx)$/, ''),
          title: data.title,
          date: data.date,
        }
      }
      return null
    })
    .filter(Boolean)

  posts.sort((a, b) => a?.date < b?.date ? 1 : -1)

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Items tagged with #{params.tag}</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post?.slug} className="border p-4 rounded-md">
            <Link href={`/posts/${post?.slug}`} className="text-xl font-semibold hover:underline">
              {post?.title}
            </Link>
            <p className="text-gray-500 mt-1">{new Date(post?.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

