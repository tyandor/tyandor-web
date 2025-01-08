import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'

const AnimatedToolCard = dynamic(() => import('../components/AnimatedToolCard'), { ssr: false })

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Explore my collection of useful tools and utilities',
  openGraph: {
    title: 'Tools',
    description: 'Explore my collection of useful tools and utilities',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Tools',
    description: 'Explore my collection of useful tools and utilities',
  },
}

export default function ToolsPage() {
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

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Tools</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <AnimatedToolCard
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
  )
}

