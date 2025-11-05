import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';

// RSS feeds to monitor
const RSS_FEEDS = [
  'https://martinfowler.com/feed.atom',
  'https://natesnewsletter.substack.com/feed',
  'https://www.oreilly.com/radar/feed/index.xml',
  'https://thetshaped.dev/feed',
  'https://blog.bytebytego.com/feed',
  'https://rss.feedspot.com/software_engineering_rss_feeds/'
];

// Number of recent items to fetch from each feed
const ITEMS_PER_FEED = 3;

interface RSSItem {
  title?: string;
  link?: string;
  content?: string;
  contentSnippet?: string;
  pubDate?: string;
  isoDate?: string;
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  console.log('Radar sync job started...');

  try {
    const parser = new Parser();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const results = {
      processed: 0,
      added: 0,
      errors: [] as string[],
    };

    for (const feedUrl of RSS_FEEDS) {
      try {
        console.log(`Fetching RSS feed: ${feedUrl}`);
        const feed = await parser.parseURL(feedUrl);

        // Get the 3 most recent items
        const recentItems = feed.items.slice(0, ITEMS_PER_FEED);

        for (const item of recentItems) {
          results.processed++;

          const technology = {
            name: item.title || 'Untitled',
            description: item.contentSnippet || item.content || 'No description available',
            quadrant: 'Techniques' as const,
            ring: 'Assess' as const,
            tags: [feed.title || 'RSS', 'Automated'],
            source_url: item.link,
          };

          // Check if this technology already exists by source URL
          if (item.link) {
            const { data: existing } = await supabase
              .from('technologies')
              .select('id')
              .eq('source_url', item.link)
              .single();

            if (!existing) {
              // Insert new technology
              const { error } = await supabase
                .from('technologies')
                .insert([technology]);

              if (error) {
                console.error(`Error inserting technology:`, error);
                results.errors.push(`Failed to insert: ${technology.name}`);
              } else {
                results.added++;
                console.log(`Added: ${technology.name}`);
              }
            } else {
              console.log(`Skipped (already exists): ${technology.name}`);
            }
          }
        }
      } catch (feedError) {
        console.error(`Error processing feed ${feedUrl}:`, feedError);
        results.errors.push(`Failed to process feed: ${feedUrl}`);
      }
    }

    console.log('Radar sync job finished.', results);

    return NextResponse.json({
      status: 'ok',
      results,
    });
  } catch (error) {
    console.error('Radar sync job failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
