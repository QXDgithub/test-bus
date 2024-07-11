import Link from 'next/link';

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1 style={{ marginBottom: '2rem' }}>Welcome to Bus TTS</h1>
      <Link href="/signin" style={{
        padding: '0.75rem 1.5rem',
        backgroundColor: '#1877f2',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
      }}>
        Sign In
      </Link>
    </div>
  );
}
