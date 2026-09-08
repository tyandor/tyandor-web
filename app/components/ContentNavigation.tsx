import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compareDesc } from 'date-fns'

interface ContentItem {
  slug: string
  title: string
  date: string
  draft: any
}

interface ContentNavigationProps {
  currentSlug: string
  contentType: string
  contentDirectory: string
  allContentHref: string
  allContentLabel: string
}

function getAdjacentContent(currentSlug: string, contentDirectory: string): { prev: ContentItem | null; next: ContentItem | null } {
  const fullDirectory = path.join(process.cwd(), contentDirectory)
  
  let fileNames: string[] = []
  try {
    fileNames = fs.readdirSync(fullDirectory)
  } catch (error) {
    console.error('Error reading directory:', fullDirectory, error)
    return { prev: null, next: null }
  }

  const content: ContentItem[] = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(fullDirectory, fileName)
      let fileContents = ''
      try {
        fileContents = fs.readFileSync(fullPath, 'utf8')
      } catch (error) {
        console.error('Error reading file:', fullPath, error)
        return null
      }
      const { data } = matter(fileContents)

      return {
        slug: fileName.replace(/\.mdx$/, ''),
        title: data.title || fileName.replace(/\.mdx$/, ''),
        date: data.date || '1970-01-01',
        draft: data.draft,
      }
    })
    .filter((item): item is ContentItem => item !== null)
    .filter(item => item.draft !== true)

  content.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  const currentIndex = content.findIndex(item => item.slug === currentSlug)

  return {
    prev: currentIndex > 0 ? content[currentIndex - 1] : null,
    next: currentIndex < content.length - 1 ? content[currentIndex + 1] : null,
  }
}

export default function ContentNavigation({ 
  currentSlug, 
  contentType, 
  contentDirectory, 
  allContentHref, 
  allContentLabel 
}: ContentNavigationProps) {
  const { prev, next } = getAdjacentContent(currentSlug, contentDirectory)

  return (
    <div className="max-w-6xl mx-auto text-center p-4">
      <div className="mt-12 inline-flex rounded-md" role="group">
        {prev ? (
          <div className="px-3 py-2 text-sm md:px-8 md:py-4 md:text-lg text-text-primary rounded-s-lg focus:z-10 focus:ring-2 focus:ring-focus focus:text-link-hover">
            <Link href={`/${contentType}/${prev.slug}`} className="text-link transition-colors">
              <span className="text-xl">&#8606;</span> {prev.title}
            </Link>
          </div>
        ) : (
          <div className="px-3 py-2 text-sm md:px-8 md:py-4 md:text-lg text-text-primary rounded-s-lg focus:z-10 focus:ring-2 focus:ring-focus focus:text-link-hover">
            <span className="text-link">&#10033;</span>
          </div>
        )}
        <div className="px-3 py-2 text-sm md:px-8 md:py-4 md:text-lg text-text-primary border-r border-l border-dotted border-link focus:z-10 focus:ring-2 focus:ring-focus focus:text-link-hover">
          <Link href={allContentHref} className="text-link transition-colors">
            {allContentLabel}
          </Link>
        </div>
        {next ? (
          <div className="px-3 py-2 text-sm md:px-8 md:py-4 md:text-lg text-text-primary rounded-e-lg focus:z-10 focus:ring-2 focus:ring-focus focus:text-link-hover">
            <Link href={`/${contentType}/${next.slug}`} className="text-link transition-colors">
              {next.title} <span className="text-xl">&#8608;</span>
            </Link>
          </div>
        ) : (
          <div className="px-3 py-2 text-sm md:px-8 md:py-4 md:text-lg text-text-primary rounded-e-lg focus:z-10 focus:ring-2 focus:ring-focus focus:text-link-hover">
            <span className="text-link">&#10033;</span>
          </div>
        )}
      </div>
    </div>
  )
}
