# ChitChat - Real-time Chat Application

A modern, real-time chat application built with Next.js 13, Socket.IO, and Material-UI.

## Features

- Real-time messaging
- File and image sharing
- Mobile responsive design
- User presence indicators
- Beautiful animations and modern UI
- Private messaging support

## Tech Stack

- Frontend:
  - Next.js 13
  - React
  - Material-UI
  - Socket.IO Client
  - TypeScript

- Backend:
  - Node.js
  - Express
  - Socket.IO
  - TypeScript

## Local Development

1. Clone the repository:
```bash
git clone [your-repo-url]
cd chitchat
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
# Terminal 1: Start the Socket.IO server
npm run server

# Terminal 2: Start the Next.js development server
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploying to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy the application:
```bash
vercel
```

4. For production deployment:
```bash
vercel --prod
```

## Environment Variables

For local development, create a `.env.local` file:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

For production (set in Vercel dashboard):
- No environment variables needed as the socket server will use the same domain

## Notes

- The application uses WebSocket with polling fallback
- File uploads are handled through base64 encoding
- The UI is optimized for both mobile and desktop views

## License

MIT