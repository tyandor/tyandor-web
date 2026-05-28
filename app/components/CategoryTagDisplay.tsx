import Link from 'next/link'

interface CategoryTagDisplayProps {
  categories?: string[]
  tags?: string[]
  className?: string
}

export function CategoryTagDisplay({ categories = [], tags = [], className = "" }: CategoryTagDisplayProps) {
  if (categories.length === 0 && tags.length === 0) {
    return null
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-8 bg-rosePine-overlay dark:bg-rosePineMoon-overlay border border-rosePine-surface dark:border-rosePineMoon-surface rounded-lg ${className}`}>
      {categories.length > 0 && (
        <div>
          <h3 className="text-lg font-bold font-mono text-rosePine-text dark:text-rosePineMoon-text">Categories</h3>
          <div className="border-b border-dotted border-rosePine-subtle/40 dark:border-rosePineMoon-subtle/40 mt-2 mb-4" />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/category/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, "-"))}`}
                className="text-sm bg-rosePine-surface dark:bg-rosePineMoon-surface border border-rosePine-foam dark:border-rosePineMoon-foam text-rosePine-foam dark:text-rosePineMoon-foam px-2 py-1 rounded-md hover:bg-rosePine-foam hover:text-rosePine-base dark:hover:bg-rosePineMoon-foam dark:hover:text-rosePineMoon-base transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div>
          <h3 className="text-lg font-bold font-mono text-rosePine-text dark:text-rosePineMoon-text">Tags</h3>
          <div className="border-b border-dotted border-rosePine-subtle/40 dark:border-rosePineMoon-subtle/40 mt-2 mb-4" />
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, "-"))}`}
                className="text-xs bg-rosePine-rose/10 dark:bg-rosePineMoon-rose/10 text-rosePine-rose dark:text-rosePineMoon-rose px-2 py-1 rounded-full border border-rosePine-rose/20 dark:border-rosePineMoon-rose/20 hover:bg-rosePine-rose hover:text-rosePine-base dark:hover:bg-rosePineMoon-rose dark:hover:text-rosePineMoon-base transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
