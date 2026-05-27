export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: '#f0ede8',
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        <span style={{ color: '#f0c040' }}>S</span>ubject·GPT
      </h1>
      <p style={{ color: '#7a7a8c', marginBottom: '2rem' }}>
        AI bilan o'qish — har qanday savol uchun aqlli javob
      </p>
      <a href="/chat" style={{
        background: '#f0c040',
        color: '#000',
        padding: '0.8rem 2rem',
        borderRadius: '10px',
        textDecoration: 'none',
        fontWeight: '600'
      }}>
        Chatni boshlash →
      </a>
    </main>
  )
}