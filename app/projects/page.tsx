import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'

const AnimatedProjectCard = dynamic(() => import('../components/AnimatedProjectCard'), { ssr: false })

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore my portfolio of projects',
  openGraph: {
    title: 'Projects',
    description: 'Explore my portfolio of projects',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Projects',
    description: 'Explore my portfolio of projects',
  },
}

export default function ProjectsPage() {
  const projectsDirectory = path.join(process.cwd(), 'projects')
  const fileNames = fs.readdirSync(projectsDirectory)

  const projects = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(projectsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug: fileName.replace(/\.mdx$/, ''),
        title: data.title,
        description: data.description,
        status: data.status,
        technologies: data.technologies,
        image: data.image || '/placeholder.svg?height=400&width=600',
        draft: data.draft,
      }
    })
    .filter(project => project.draft !== true)

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-7xl font-bold font-mono mb-8 text-rosePine-rose">Projects</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <AnimatedProjectCard
            key={project.slug}
            slug={project.slug}
            title={project.title}
            description={project.description}
            status={project.status}
            technologies={project.technologies}
            image={project.image}
          />
        ))}
      </div>
    </div>
  )
}

