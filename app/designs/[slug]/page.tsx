import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { Metadata } from 'next'
import Image from 'next/image'
import { compareDesc } from 'date-fns'
import { CategoryTagDisplay } from '@/app/components/CategoryTagDisplay'

interface Design {
  slug: string;
  title: string;
  date: string;
}

function getAdjacentDesigns(currentSlug: string): { prev: Design | null; next: Design | null } {
  const designsDirectory = path.join(process.cwd(), 'designs')
  const fileNames = fs.readdirSync(designsDirectory)

  const designs: Design[] = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(designsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)
      
      return {
        slug: fileName.replace(/\.mdx$/, ''),
        title: data.title,
        date: data.date,
      }
    })

  designs.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  const currentIndex = designs.findIndex(design => design.slug === currentSlug)

  return {
    prev: currentIndex > 0 ? designs[currentIndex - 1] : null,
    next: currentIndex < designs.length - 1 ? designs[currentIndex + 1] : null,
  }
}

export async function generateStaticParams() {
  const designsDirectory = path.join(process.cwd(), 'designs')
  const fileNames = fs.readdirSync(designsDirectory)

  return fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => ({
      slug: fileName.replace(/\.mdx$/, ''),
    }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const fullPath = path.join(process.cwd(), 'designs', `${params.slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data } = matter(fileContents)

  return {
    title: `Design: ${data.title}`,
    description: data.description || `Learn more about the design: ${data.title}`,
    openGraph: {
      title: `Design: ${data.title}`,
      description: data.description || `Learn more about the design: ${data.title}`,
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
      title: `Design: ${data.title}`,
      description: data.description || `Learn more about the design: ${data.title}`,
    },
  }
}

export default async function Design({ params }: { params: { slug: string } }) {
  const fullPath = path.join(process.cwd(), 'designs', `${params.slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const { prev, next } = getAdjacentDesigns(params.slug)

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
      <CategoryTagDisplay 
        categories={data.categories} 
        tags={data.tags} 
        className="mb-6" 
      />
      <div className="prose text-rosePine-text dark:text-rosePineDawn-text max-w-none">
        <MDXRemote source={content} />
      </div>
      <div className="mt-8">
        <Link href="/designs" className="text-blue-500 hover:underline">
          ← Back to all designs
        </Link>
      </div>
      <div className="mt-8 flex justify-between">
      {prev && (
        <Link href={`/designs/${prev.slug}`} className="text-rosePine-foam dark:text-rosePineDawn-foam hover:text-rosePine-pine dark:hover:text-rosePineDawn-pine transition-colors">
          ← {prev.title}
        </Link>
      )}
      {next && (
        <Link href={`/designs/${next.slug}`} className="text-rosePine-foam dark:text-rosePineDawn-foam hover:text-rosePine-pine dark:hover:text-rosePineDawn-pine transition-colors">
          {next.title} →
        </Link>
      )}
    </div>
    </div>
  )
}

