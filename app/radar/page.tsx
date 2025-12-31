import { createNeonClient } from '@/lib/db/neon';
import RadarWrapper from '@/app/components/RadarWrapper';

// Define types for our data
export interface Technology {
  id: string;
  name: string;
  description: string;
  quadrant: 'Techniques' | 'Tools' | 'Platforms' | 'Languages & Frameworks';
  ring: 'Adopt' | 'Trial' | 'Assess' | 'Hold';
  tags: string[];
  source_url?: string;
}

export interface TechnologyHistory {
    id: number;
    technology_id: string;
    change_description: string;
    changed_at: string;
    changed_by: string;
}

async function getTechnologies() {
  try {
    const sql = createNeonClient();
    const data = await sql`
      SELECT * FROM technologies
      ORDER BY name ASC
    `;
    return data as Technology[];
  } catch (error) {
    console.error('Error fetching technologies:', error);
    return [];
  }
}

async function getHistory() {
  try {
    const sql = createNeonClient();
    const data = await sql`
      SELECT * FROM technology_history
      ORDER BY changed_at DESC
    `;
    return data as TechnologyHistory[];
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
}

export default async function RadarPage() {
  const technologies = await getTechnologies();
  const history = await getHistory();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Technology Radar</h1>
      <RadarWrapper technologies={technologies} history={history} />
    </main>
  );
}
