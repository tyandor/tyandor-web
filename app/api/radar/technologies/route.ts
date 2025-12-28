import { createClient } from '@/lib/supabase/server';
import { createNeonClient } from '@/lib/db/neon';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const sql = createNeonClient();
    const technologies = await sql`
      SELECT * FROM technologies
      ORDER BY name ASC
    `;

    return NextResponse.json(technologies);
  } catch (error) {
    console.error('Error fetching technologies:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch technologies' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Still use Supabase for authentication
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

    const sql = createNeonClient();

    // Insert new technology
    const newTechnology = await sql`
      INSERT INTO technologies (name, description, quadrant, ring, tags, source_url)
      VALUES (
        ${body.name},
        ${body.description || null},
        ${body.quadrant},
        ${body.ring},
        ${body.tags || []},
        ${body.source_url || null}
      )
      RETURNING *
    `;

    if (!newTechnology || newTechnology.length === 0) {
      return NextResponse.json({ error: 'Failed to create technology' }, { status: 500 });
    }

    const created = newTechnology[0];

    // Add to history
    try {
      await sql`
        INSERT INTO technology_history (technology_id, change_description, changed_by)
        VALUES (${created.id}, 'Created.', ${user.email})
      `;
    } catch (historyError) {
      // Log this error but don't fail the whole request
      console.error('Failed to insert into history:', historyError);
    }

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating technology:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create technology' },
      { status: 500 }
    );
  }
}
