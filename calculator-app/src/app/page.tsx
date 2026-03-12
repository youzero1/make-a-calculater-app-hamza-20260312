'use client';

import Calculator from '../components/Calculator';

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a0000 0%, #4a0000 50%, #1a0000 100%)',
        padding: '20px',
      }}
    >
      <h1
        style={{
          color: '#EF5350',
          fontSize: '2rem',
          marginBottom: '24px',
          letterSpacing: '0.1em',
          textShadow: '0 0 20px rgba(239, 83, 80, 0.5)',
          fontWeight: 700,
        }}
      >
        {process.env.NEXT_PUBLIC_APP_TITLE || 'Calculator'}
      </h1>
      <Calculator />
    </main>
  );
}
