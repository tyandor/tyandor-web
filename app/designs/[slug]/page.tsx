import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Metadata } from 'next'
import Image from 'next/image'
import { CategoryTagDisplay } from '@/app/components/CategoryTagDisplay'
import ContentNavigation from '@/components/ContentNavigation'

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

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl md:text-3xl font-bold italic mb-4">{data.title}</h1>
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
      <div className="prose text-rosePine-text dark:text-rosePineDawn-text max-w-none">
        <MDXRemote source={content} />
      </div>
      <CategoryTagDisplay
        categories={data.categories}
        tags={data.tags}
        className="mt-8"
      />
      <ContentNavigation
        currentSlug={params.slug}
        contentType="designs"
        contentDirectory="designs"
        allContentHref="/designs"
        allContentLabel="All Designs"
      />
    </div>
  )
}

