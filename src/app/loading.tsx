'use client'

import { Container, Box, CircularProgress } from '@mui/material'

export default function Loading() {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <CircularProgress
          sx={{
            color: (theme) =>
              theme.palette.mode === 'light' ? '#4ECDC4' : '#FF6B6B',
          }}
        />
      </Box>
    </Container>
  )
}
