import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  const supabase = createClient();
  const { data: technologies, error } = await supabase
    .from('technologies')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(technologies);
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Validate body
  if (!body.name || !body.quadrant || !body.ring) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data: newTechnology, error: insertError } = await supabase
    .from('technologies')
    .insert({
      name: body.name,
      description: body.description,
      quadrant: body.quadrant,
      ring: body.ring,
      tags: body.tags,
      source_url: body.source_url,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Add to history
  const { error: historyError } = await supabase
    .from('technology_history')
    .insert({
      technology_id: newTechnology.id,
      change_description: 'Created.',
      changed_by: user.email,
    });

  if (historyError) {
    // Log this error but don't fail the whole request
    console.error('Failed to insert into history:', historyError.message);
  }

  return NextResponse.json(newTechnology, { status: 201 });
}
