import '../styles/login.css'
import { Auth } from '@supabase/auth-ui-react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import supabase from '../lib/supabaseClient';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    const checkSessionAndRedirect = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push('/');
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        router.push('/');
      }
    });

    checkSessionAndRedirect();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="login-page">
      <div className="login-brand">OnStart</div>
      <div className="login-box">
        <h1 className="login-title">Ready for Day One?</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#7e57c2',
                  brandAccent: '#673ab7',
                },
                fonts: {
                  bodyFontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`,
                  buttonFontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`,
                },
              },
            },
           }}
          theme="light"
          providers={[]}
        />
      </div>
    </div>
  );
}
