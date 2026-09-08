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
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-8 bg-layer-02 border border-border-subtle rounded-lg ${className}`}>
      {categories.length > 0 && (
        <div>
          <h3 className="text-lg font-bold font-mono text-text-primary">Categories</h3>
          <div className="border-b border-dotted border-border-strong/40 mt-2 mb-4" />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/category/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, "-"))}`}
                className="text-sm bg-layer-01 border border-link text-link px-2 py-1 rounded-md hover:bg-link hover:text-text-on-color transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div>
          <h3 className="text-lg font-bold font-mono text-text-primary">Tags</h3>
          <div className="border-b border-dotted border-border-strong/40 mt-2 mb-4" />
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, "-"))}`}
                className="text-xs bg-layer-02 text-text-secondary px-2 py-1 rounded-full border border-border-subtle hover:bg-layer-hover hover:text-text-primary transition-colors"
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
