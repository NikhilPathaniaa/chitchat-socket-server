'use client';

import { Box, List, ListItem, ListItemButton, ListItemText, Typography, Avatar, Badge, Paper } from '@mui/material';
import { useSocket } from '@/context/SocketContext';

interface User {
  id: string;
  username: string;
}

interface OnlineUsersProps {
  selectedUser: string | null;
  onSelectUser: (username: string) => void;
}

export default function OnlineUsers({ selectedUser, onSelectUser }: OnlineUsersProps) {
  const { onlineUsers, username } = useSocket();

  // Filter out current user
  const filteredUsers = onlineUsers.filter(user => user.username !== username);

  return (
    <Paper
      elevation={1}
      sx={{
        height: '100%',
        background: '#ffffff',
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" component="div">
            Online Users ({filteredUsers.length})
          </Typography>
        </Box>

        <List sx={{ flex: 1, overflowY: 'auto' }}>
          {filteredUsers.map((user) => (
            <ListItem
              key={user.id}
              disablePadding
              sx={{
                bgcolor: selectedUser === user.username ? 'action.selected' : 'transparent',
              }}
            >
              <ListItemButton
                onClick={() => onSelectUser(user.username)}
                sx={{
                  px: 2,
                  py: 1.5,
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  color="success"
                  sx={{ mr: 2 }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                    }}
                  >
                    {user.username[0].toUpperCase()}
                  </Avatar>
                </Badge>
                <ListItemText
                  primary={user.username}
                  primaryTypographyProps={{
                    variant: 'body1',
                    fontWeight: selectedUser === user.username ? 500 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
}
