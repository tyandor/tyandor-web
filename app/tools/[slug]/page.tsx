import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { Metadata } from 'next'
import Image from 'next/image'
import { compareDesc } from 'date-fns'

interface Tool {
  slug: string;
  title: string;
  date: string;
}

function getAdjacentTools(currentSlug: string): { prev: Tool | null; next: Tool | null } {
  const toolsDirectory = path.join(process.cwd(), 'tools')
  const fileNames = fs.readdirSync(toolsDirectory)

  const tools: Tool[] = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(toolsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)
      
      return {
        slug: fileName.replace(/\.mdx$/, ''),
        title: data.title,
        date: data.date,
      }
    })

  tools.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  const currentIndex = tools.findIndex(tool => tool.slug === currentSlug)

  return {
    prev: currentIndex > 0 ? tools[currentIndex - 1] : null,
    next: currentIndex < tools.length - 1 ? tools[currentIndex + 1] : null,
  }
}

export async function generateStaticParams() {
  const toolsDirectory = path.join(process.cwd(), 'tools')
  const fileNames = fs.readdirSync(toolsDirectory)

  return fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => ({
      slug: fileName.replace(/\.mdx$/, ''),
    }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const fullPath = path.join(process.cwd(), 'tools', `${params.slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data } = matter(fileContents)

  return {
    title: `Tool: ${data.title}`,
    description: data.description || `Learn more about the tool: ${data.title}`,
    openGraph: {
      title: `Tool: ${data.title}`,
      description: data.description || `Learn more about the tool: ${data.title}`,
      type: 'article',
      images: [
        {
          url: data.image || '/placeholder.svg?height=600&width=1200',
          width: 1200,
          height: 600,
          alt: data.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Tool: ${data.title}`,
      description: data.description || `Learn more about the tool: ${data.title}`,
    },
  }
}

export default async function Tool({ params }: { params: { slug: string } }) {
  const fullPath = path.join(process.cwd(), 'tools', `${params.slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const { prev, next } = getAdjacentTools(params.slug)

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
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
        <span className="font-semibold">Category:</span> {data.category}
      </div>
      <div className="prose max-w-none">
        <MDXRemote source={content} />
      </div>
      {data.link && (
        <div className="mt-8">
          <a href={data.link} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Try Tool
          </a>
        </div>
      )}
      <div className="mt-8">
        <Link href="/tools" className="text-blue-500 hover:underline">
          ← Back to all tools
        </Link>
      </div>
      <div className="mt-8 flex justify-between">
      {prev && (
        <Link href={`/tools/${prev.slug}`} className="text-rosePine-foam dark:text-rosePineDawn-foam hover:text-rosePine-pine dark:hover:text-rosePineDawn-pine transition-colors">
          ← {prev.title}
        </Link>
      )}
      {next && (
        <Link href={`/tools/${next.slug}`} className="text-rosePine-foam dark:text-rosePineDawn-foam hover:text-rosePine-pine dark:hover:text-rosePineDawn-pine transition-colors">
          {next.title} →
        </Link>
      )}
    </div>
    </div>
  )
}

