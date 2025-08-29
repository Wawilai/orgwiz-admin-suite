import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { userData, profileData, roleId } = await req.json();
    
    console.log('Creating user with data:', { 
      email: userData.email, 
      profileData: Object.keys(profileData),
      roleId 
    });

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';

    // Create user in auth system
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        first_name: profileData.first_name,
        last_name: profileData.last_name
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'ไม่สามารถสร้างบัญชีผู้ใช้ได้', details: authError.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!authData.user) {
      return new Response(
        JSON.stringify({ error: 'ไม่สามารถสร้างบัญชีผู้ใช้ได้' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Clean profile data - convert empty strings to null for date fields
    const cleanedProfileData = { ...profileData };
    if (cleanedProfileData.start_date === '') cleanedProfileData.start_date = null;
    if (cleanedProfileData.end_date === '') cleanedProfileData.end_date = null;

    // Create profile with user_id from auth
    const { data: profileResult, error: profileError } = await supabase
      .from('profiles')
      .insert([{
        ...cleanedProfileData,
        user_id: authData.user.id,
      }])
      .select()
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      // Delete auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return new Response(
        JSON.stringify({ error: 'ไม่สามารถสร้างโปรไฟล์ผู้ใช้ได้', details: profileError.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Assign role if provided
    if (roleId && profileResult) {
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{
          user_id: authData.user.id,
          role_id: roleId,
          assigned_by: authData.user.id,
          is_active: true
        }]);

      if (roleError) {
        console.error('Role assignment error:', roleError);
        // Don't fail the entire operation, just log the error
      }
    }

    console.log('User created successfully:', authData.user.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: authData.user,
        profile: profileResult,
        tempPassword 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in create-user function:', error);
    return new Response(
      JSON.stringify({ error: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้งาน', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});