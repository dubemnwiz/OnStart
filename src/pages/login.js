import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import supabase from '../lib/supabaseClient';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="light"
        providers={[]} // optional: use ['email', 'google'] if you enabled both
      />
    </div>
  );
}