import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'

const AnimatedIdeaCard = dynamic(() => import('../components/AnimatedIdeaCard'), { ssr: false })

export const metadata: Metadata = {
  title: 'Ideas',
  description: 'Explore innovative ideas and concepts',
  openGraph: {
    title: 'Ideas',
    description: 'Explore innovative ideas and concepts',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Ideas',
    description: 'Explore innovative ideas and concepts',
  },
}

export default function IdeasPage() {
  const ideasDirectory = path.join(process.cwd(), 'ideas')
  const fileNames = fs.readdirSync(ideasDirectory)

  const ideas = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(ideasDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        id: fileName.replace(/\.mdx$/, ''),
        title: data.title,
        summary: data.summary,
        category: data.category,
      }
    })

  // Group ideas by category
  const groupedIdeas: Record<string, typeof ideas> = ideas.reduce((acc: Record<string, typeof ideas>, idea) => {
    if (!acc[idea.category]) {
      acc[idea.category] = []
    }
    acc[idea.category].push(idea)
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-7xl font-bold italic mb-8 text-rosePine-rose">Ideas</h1>
      {Object.entries(groupedIdeas).map(([category, categoryIdeas]) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{category}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {categoryIdeas.map((idea) => (
              <AnimatedIdeaCard
                key={idea.id}
                id={idea.id}
                title={idea.title}
                summary={idea.summary}
                category={idea.category}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

