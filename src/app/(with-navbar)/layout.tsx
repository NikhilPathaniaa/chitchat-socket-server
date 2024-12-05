import Navbar from '@/components/Navbar'

export default function WithNavbarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ 
        flex: 1,
        paddingTop: '64px',
        background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
        overflow: 'auto',
        position: 'relative'
      }}>
        {children}
      </main>
    </div>
  )
}
