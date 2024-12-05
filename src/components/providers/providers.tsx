'use client'

import { ThemeProvider } from '@/components/providers/theme-provider'
import { SocketProvider } from '@/lib/socket/context'
import StyledComponentsRegistry from '@/lib/registry'
import { LayoutProvider } from '@/components/providers/layout-provider'
import { NavigationProvider } from '@/components/providers/navigation-provider'
import { MUIProvider } from '@/components/providers/MUIProvider'
import { Box } from '@mui/material'
import { usePathname } from 'next/navigation'
import { ErrorBoundary } from '@/components/error-boundary'

interface ProvidersProps {
  children: React.ReactNode
}

function ProvidersContent({ children }: ProvidersProps) {
  const pathname = usePathname()
  const isChatRoom = pathname === '/chat/room'

  return (
    <StyledComponentsRegistry>
      <ThemeProvider>
        <MUIProvider>
          <SocketProvider>
            <NavigationProvider>
              <LayoutProvider>
                {isChatRoom ? (
                  children
                ) : (
                  <Box sx={{ 
                    pt: { xs: '70px', sm: '70px' },
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {children}
                  </Box>
                )}
              </LayoutProvider>
            </NavigationProvider>
          </SocketProvider>
        </MUIProvider>
      </ThemeProvider>
    </StyledComponentsRegistry>
  )
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <ProvidersContent>
        {children}
      </ProvidersContent>
    </ErrorBoundary>
  )
}
