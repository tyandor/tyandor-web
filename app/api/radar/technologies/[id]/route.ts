import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const alertEmailTo = process.env.ALERT_EMAIL_TO;

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const id = params.id;

  // Get the original record
  const { data: original, error: fetchError } = await supabase
    .from('technologies')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !original) {
    return NextResponse.json({ error: 'Technology not found' }, { status: 404 });
  }

  // Update the record
  const { data: updatedTechnology, error: updateError } = await supabase
    .from('technologies')
    .update({
      name: body.name,
      description: body.description,
      quadrant: body.quadrant,
      ring: body.ring,
      tags: body.tags,
      source_url: body.source_url,
      last_updated: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Check for ring change and log to history
  if (original.ring !== updatedTechnology.ring) {
    const change_description = `Moved from ${original.ring} to ${updatedTechnology.ring}.`;
    const { error: historyError } = await supabase
      .from('technology_history')
      .insert({
        technology_id: id,
        change_description,
        changed_by: user.email,
      });

    if (historyError) {
      console.error('Failed to insert into history:', historyError.message);
    }

    // Send email alert
    if (alertEmailTo) {
      try {
        await resend.emails.send({
          from: 'Technology Radar <no-reply@your-domain.com>', // Replace with your domain
          to: alertEmailTo,
          subject: `Radar Update: ${updatedTechnology.name} moved rings`,
          html: `<p>${updatedTechnology.name} was moved from the <strong>${original.ring}</strong> ring to the <strong>${updatedTechnology.ring}</strong> ring by ${user.email}.</p>`,
        });
      } catch (emailError) {
        console.error('Failed to send email alert:', emailError);
      }
    }
  }

  return NextResponse.json(updatedTechnology);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = params.id;

  const { error } = await supabase
    .from('technologies')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new Response(null, { status: 204 }); // No Content
}
