import { createClient } from '@supabase/supabase-js';

// Admin account details
const adminDetails = {
  fullName: "Alexandra Reynolds",
  email: "alexandra.reynolds@moderntimesmedia.com",
  password: "MT$Admin2025!",
  role: "admin"
};

async function createAdminAccount() {
  // Get Supabase credentials from environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials not found in environment variables');
    return;
  }

  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // Create user in auth
    console.log('Creating admin user in auth...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminDetails.email,
      password: adminDetails.password,
      options: {
        data: {
          full_name: adminDetails.fullName,
          role: adminDetails.role,
        },
      },
    });

    if (authError) {
      throw authError;
    }

    console.log('Auth user created successfully:', authData.user.id);

    // Create author record manually
    if (authData.user) {
      console.log('Creating author record...');
      const { error: authorError } = await supabase.from('authors').insert({
        id: authData.user.id,
        name: adminDetails.fullName,
        email: adminDetails.email,
        password: 'MANAGED_BY_SUPABASE_AUTH',
        role: adminDetails.role,
        status: 'active'
      });
      
      if (authorError) {
        throw authorError;
      }
      
      console.log('Author record created successfully');
    }

    console.log('\n=== ADMIN ACCOUNT CREATED SUCCESSFULLY ===');
    console.log('Full Name:', adminDetails.fullName);
    console.log('Email:', adminDetails.email);
    console.log('Password:', adminDetails.password);
    console.log('Role:', adminDetails.role);
    console.log('==========================================\n');

  } catch (error) {
    console.error('Error creating admin account:', error);
  }
}

// Execute the function
createAdminAccount();