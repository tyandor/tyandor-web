import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
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
  const supabase = createClient();
  const { data, error } = await supabase
    .from('technologies')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching technologies:', error);
    return [];
  }
  return data;
}

async function getHistory() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('technology_history')
      .select('*')
      .order('changed_at', { ascending: false });
  
    if (error) {
      console.error('Error fetching history:', error);
      return [];
    }
    return data;
  }

export default async function RadarPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/radar');
  }

  const technologies = await getTechnologies();
  const history = await getHistory();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Technology Radar</h1>
      <RadarWrapper technologies={technologies} history={history} />
    </main>
  );
}
