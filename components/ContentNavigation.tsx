import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compareDesc } from 'date-fns'

interface ContentItem {
  slug: string
  title: string
  date: string
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
  const fileNames = fs.readdirSync(fullDirectory)

  const content: ContentItem[] = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const fullPath = path.join(fullDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug: fileName.replace(/\.mdx$/, ''),
        title: data.title,
        date: data.date,
      }
    })

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
      <div className="my-12 inline-flex rounded-md shadow-2xl" role="group">
        {prev ? (
          <div className="px-8 py-4 text-lg text-gray-900 rounded-s-lg focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:text-white dark:focus:ring-blue-500 dark:focus:text-white">
            <Link href={`/${contentType}/${prev.slug}`} className="text-rosePine-foam dark:text-rosePineMoon-foam dark:hover:text-rosePineMoon-pine transition-colors">
              ← {prev.title}
            </Link>
          </div>
        ) : (
          <div className="px-8 py-4 text-lg text-gray-900 rounded-s-lg focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:text-white dark:focus:ring-blue-500 dark:focus:text-white">
            <span className="text-rosePine-foam">&#10033;</span>
          </div>
        )}
        <div className="px-8 py-4 text-lg text-gray-900 border-r border-l border-dotted border-rosePine-foam focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:text-white dark:focus:ring-blue-500 dark:focus:text-white">
          <Link href={allContentHref} className="text-rosePine-foam dark:text-rosePineMoon-foam dark:hover:text-rosePineMoon-pine transition-colors">
            {allContentLabel}
          </Link>
        </div>
        {next ? (
          <div className="px-8 py-4 text-lg text-gray-900 rounded-e-lg focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:text-white dark:focus:ring-blue-500 dark:focus:text-white">
            <Link href={`/${contentType}/${next.slug}`} className="text-rosePine-foam dark:text-rosePineMoon-foam dark:hover:text-rosePineMoon-pine transition-colors">
              {next.title} →
            </Link>
          </div>
        ) : (
          <div className="px-8 py-4 text-lg text-gray-900 rounded-e-lg focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:text-white dark:focus:ring-blue-500 dark:focus:text-white">
            <span className="text-rosePine-foam">&#10033;</span>
          </div>
        )}
      </div>
    </div>
  )
}
