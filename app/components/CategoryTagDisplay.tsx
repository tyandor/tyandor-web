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
    <div className={`flex flex-wrap gap-2 items-center px-6 py-10 bg-rosePine-overlay border border-rosePine-surface rounded-lg ${className}`}>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-sm uppercase text-rosePine-subtle dark:text-rosePineMoon-subtle font-medium">Categories:</span>
          {categories.map((category, index) => (
            <span key={category} className="flex items-center">
              <Link 
                href={`/category/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, "-"))}`}
                className="text-sm bg-rosePine-surface dark:bg-rosePineMoon-surface border border-rosePine-foam text-rosePine-foam dark:text-rosePineMoon-foam px-2 py-1 rounded-md hover:bg-rosePine-foam hover:text-rosePine-base dark:hover:bg-rosePineMoon-foam dark:hover:text-rosePineMoon-base transition-colors"
              >
                {category}
              </Link>
              {index < categories.length - 1 && <span className="text-rosePine-subtle dark:text-rosePineMoon-subtle mx-1"></span>}
            </span>
          ))}
        </div>
      )}
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-sm uppercase text-rosePine-subtle dark:text-rosePineMoon-subtle font-medium">Tags:</span>
          {tags.map((tag, index) => (
            <span key={tag} className="flex items-center">
              <Link 
                href={`/tag/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, "-"))}`}
                className="text-xs bg-rosePine-rose/10 dark:bg-rosePineMoon-rose/10 text-rosePine-rose dark:text-rosePineMoon-rose px-2 py-1 rounded-full border border-rosePine-rose/20 dark:border-rosePineMoon-rose/20 hover:bg-rosePine-rose hover:text-rosePine-base dark:hover:bg-rosePineMoon-rose dark:hover:text-rosePineMoon-base transition-colors"
              >
                #{tag}
              </Link>
              {index < tags.length - 1 && <span className="text-rosePine-subtle dark:text-rosePineMoon-subtle mx-1"></span>}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
