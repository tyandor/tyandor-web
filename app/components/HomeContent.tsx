import dynamic from 'next/dynamic'

const AnimatedHomeArticleCard = dynamic(() => import('./AnimatedHomeArticleCard'))
const AnimatedHomeQuote = dynamic(() => import('./AnimatedHomeQuote'))
const AnimatedHomeToolCard = dynamic(() => import('./AnimatedHomeToolCard'))
const AnimatedHomeDesignCard = dynamic(() => import('./AnimatedHomeDesignCard'))

interface Article {
  slug: string
  title: string
  date: string
  description: string
  author: string
}

interface Quote {
  slug: string
  author: string
  quote: string
}

interface Tool {
  slug: string
  title: string
  description: string
  category: string
  image: string
}

interface Design {
  slug: string
  title: string
  description: string
  image: string
}

interface HomeContentProps {
  recentArticles: Article[]
  randomQuote: Quote | null
  recentTools: Tool[]
  recentDesigns: Design[]
}

export function HomeContent({ recentArticles, randomQuote, recentTools, recentDesigns }: HomeContentProps) {
  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 gap-4 my-10 articles-section">
          <h2 className="text-2xl mb-2 font-bold font-mono text-rosePine-rose dark:text-rosePineMoon-rose">articles</h2>
          {recentArticles.map((article) => (
            <AnimatedHomeArticleCard
              key={article.slug}
              slug={article.slug}
              title={article.title}
              description={article.description}
            />
          ))}
        </div>
      </div>
      <div className="max-w-7xl py-4 mx-auto">
        {randomQuote && (
          <AnimatedHomeQuote
            quote={randomQuote.quote}
            author={randomQuote.author}
            slug={randomQuote.slug}
          />
        )}
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="mt-4 mb-12">
          <h2 className="text-2xl mb-4 font-bold font-mono text-rosePine-rose dark:text-rosePineMoon-rose">tools</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {recentTools.map((tool) => (
              <AnimatedHomeToolCard
                key={tool.slug}
                slug={tool.slug}
                title={tool.title}
                description={tool.description}
                category={tool.category}
                image={tool.image}
              />
            ))}
          </div>
        </div>
        <div className="my-10">
          <h2 className="text-2xl mb-4 font-bold font-mono text-rosePine-rose dark:text-rosePineMoon-rose">design</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {recentDesigns.map((design) => (
              <AnimatedHomeDesignCard
                key={design.slug}
                slug={design.slug}
                title={design.title}
                description={design.description}
                image={design.image}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
