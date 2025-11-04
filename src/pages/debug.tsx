'use client';

import { useEffect, useState } from 'react';

export default function Debug() {
  const [envVars, setEnvVars] = useState({
    url: '',
    key: ''
  });

  useEffect(() => {
    setEnvVars({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '***SET***' : 'NOT SET'
    });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Environment Debug</h1>
      <p>NEXT_PUBLIC_SUPABASE_URL: {envVars.url}</p>
      <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {envVars.key}</p>
    </div>
  );
}
