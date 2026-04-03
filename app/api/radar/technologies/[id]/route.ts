import { createNeonClient } from '@/lib/db/neon';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const alertEmailTo = process.env.ALERT_EMAIL_TO;

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const id = params.id;
    const sql = createNeonClient();

    // Get the original record
    const originalResult = await sql`
      SELECT * FROM technologies
      WHERE id = ${id}
      LIMIT 1
    `;

    if (!originalResult || originalResult.length === 0) {
      return NextResponse.json({ error: 'Technology not found' }, { status: 404 });
    }

    const original = originalResult[0];

    // Update the record
    const updatedResult = await sql`
      UPDATE technologies
      SET
        name = ${body.name},
        description = ${body.description || null},
        quadrant = ${body.quadrant},
        ring = ${body.ring},
        tags = ${body.tags || []},
        source_url = ${body.source_url || null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!updatedResult || updatedResult.length === 0) {
      return NextResponse.json({ error: 'Failed to update technology' }, { status: 500 });
    }

    const updatedTechnology = updatedResult[0];

    // Check for ring change and log to history
    if (original.ring !== updatedTechnology.ring) {
      const change_description = `Moved from ${original.ring} to ${updatedTechnology.ring}.`;

      try {
        await sql`
          INSERT INTO technology_history (technology_id, change_description, changed_by)
          VALUES (${id}, ${change_description}, 'system')
        `;
      } catch (historyError) {
        console.error('Failed to insert into history:', historyError);
      }

      // Send email alert
      if (alertEmailTo && process.env.RESEND_API_KEY) {
        try {
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: 'Technology Radar <no-reply@your-domain.com>', // Replace with your domain
            to: alertEmailTo,
            subject: `Radar Update: ${updatedTechnology.name} moved rings`,
            html: `<p>${updatedTechnology.name} was moved from the <strong>${original.ring}</strong> ring to the <strong>${updatedTechnology.ring}</strong> ring.</p>`,
          });
        } catch (emailError) {
          console.error('Failed to send email alert:', emailError);
        }
      }
    }

    return NextResponse.json(updatedTechnology);
  } catch (error) {
    console.error('Error updating technology:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update technology' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const sql = createNeonClient();

    await sql`
      DELETE FROM technologies
      WHERE id = ${id}
    `;

    return new Response(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting technology:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete technology' },
      { status: 500 }
    );
  }
}
