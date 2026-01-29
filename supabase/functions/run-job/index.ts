import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const WEBHOOK_URL = Deno.env.get('WEBHOOK_URL') || 'https://webhook.site/test';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const jobId = pathParts[1];

    if (!jobId) {
      return new Response(
        JSON.stringify({ error: 'Job ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the job
    const { data: job, error: fetchError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (fetchError || !job) {
      return new Response(
        JSON.stringify({ error: 'Job not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Set status to "running"
    await supabase
      .from('jobs')
      .update({ status: 'running' })
      .eq('id', jobId);

    console.log(`Job ${jobId} started running`);

    // Step 2: Simulate processing (3 seconds)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Step 3: Set status to "completed" and add completed_at timestamp
    const completedAt = new Date().toISOString();
    await supabase
      .from('jobs')
      .update({ 
        status: 'completed',
        completed_at: completedAt 
      })
      .eq('id', jobId);

    console.log(`Job ${jobId} completed`);

    // Step 4: Trigger webhook
    const webhookPayload = {
      jobId: job.id,
      taskName: job.task_name,
      priority: job.priority,
      payload: job.payload,
      completedAt: completedAt
    };

    let webhookResponse = null;
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload)
      });
      
      webhookResponse = {
        status: response.status,
        statusText: response.statusText,
        timestamp: new Date().toISOString()
      };

      console.log(`Webhook triggered for job ${jobId}:`, webhookResponse);

      // Store webhook response in database
      await supabase
        .from('jobs')
        .update({ webhook_response: webhookResponse })
        .eq('id', jobId);

    } catch (webhookError) {
      console.error('Webhook error:', webhookError);
      const errorMessage = webhookError instanceof Error ? webhookError.message : 'Unknown error';
      webhookResponse = {
        error: errorMessage,
        timestamp: new Date().toISOString()
      };

      await supabase
        .from('jobs')
        .update({ webhook_response: webhookResponse })
        .eq('id', jobId);
    }

    // Fetch updated job
    const { data: updatedJob } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    return new Response(
      JSON.stringify({ 
        message: 'Job completed successfully',
        job: updatedJob,
        webhookResponse 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
