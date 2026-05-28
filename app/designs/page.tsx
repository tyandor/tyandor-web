import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'

const AnimatedDesignCard = dynamic(() => import('../components/AnimatedDesignCard'), { ssr: false })

export const metadata: Metadata = {
  title: 'Designs',
  description: 'Explore my collection of design projects and concepts',
  openGraph: {
    title: 'Designs',
    description: 'Explore my collection of design projects and concepts',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Designs',
    description: 'Explore my collection of design projects and concepts',
  },
}

export default function DesignsPage() {
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
        category: data.category,
        image: data.image || '/placeholder.svg?height=400&width=600',
        draft: data.draft,
      }
    })
    .filter(design => design.draft !== true)

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-7xl font-bold mb-8 text-rosePine-rose">Design</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {designs.map((design) => (
          <AnimatedDesignCard
            key={design.slug}
            slug={design.slug}
            title={design.title}
            description={design.description}
            category={design.category}
            image={design.image}
          />
        ))}
      </div>
    </div>
  )
}

