import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Metadata } from 'next'
import Image from 'next/image'
import { CategoryTagDisplay } from '@/app/components/CategoryTagDisplay'
import ContentNavigation from '@/app/components/ContentNavigation'

export async function generateStaticParams() {
  const projectsDirectory = path.join(process.cwd(), 'projects')
  const fileNames = fs.readdirSync(projectsDirectory)

  return fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .filter(fileName => {
      const { data } = matter(fs.readFileSync(path.join(projectsDirectory, fileName), 'utf8'))
      return data.draft !== true
    })
    .map((fileName) => ({
      slug: fileName.replace(/\.mdx$/, ''),
    }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const fullPath = path.join(process.cwd(), 'projects', `${slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data } = matter(fileContents)

  return {
    title: `Project: ${data.title}`,
    description: data.description || `Learn more about the project: ${data.title}`,
    openGraph: {
      title: `Project: ${data.title}`,
      description: data.description || `Learn more about the project: ${data.title}`,
      type: 'article',
      images: [
        {
          url: data.image || '/placeholder.svg',
          width: 1200,
          height: 600,
          alt: data.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Project: ${data.title}`,
      description: data.description || `Learn more about the project: ${data.title}`,
    },
  }
}

export default async function Project({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const fullPath = path.join(process.cwd(), 'projects', `${slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl md:text-3xl font-bold font-mono mb-4">{data.title}</h1>
      {data.image && (
        <div className="mb-6">
          <Image
            src={data.image}
            alt={data.title}
            width={1200}
            height={600}
            className="rounded-lg shadow-md"
          />
        </div>
      )}
      <div className="mb-6">
        <span className="font-semibold">Status:</span> {data.status}
        <span className="mx-2">|</span>
        <span className="font-semibold">Technologies:</span> {data.technologies.join(', ')}
      </div>
      <div className="prose max-w-none">
        <MDXRemote source={content} />
      </div>
      {data.link && (
        <div className="mt-8">
          <a href={data.link} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            View Project
          </a>
        </div>
      )}
      <CategoryTagDisplay
        categories={data.categories}
        tags={data.tags}
        className="mt-8"
      />
      <ContentNavigation
        currentSlug={slug}
        contentType="projects"
        contentDirectory="projects"
        allContentHref="/projects"
        allContentLabel="All Projects"
      />
    </div>
  )
}

