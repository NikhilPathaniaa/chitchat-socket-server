export interface Reaction {
  emoji: string;
  from: string;
}

export interface Message {
  id: string;
  text: string;
  username: string;  // For backward compatibility
  from?: string;     // New field for sender
  timestamp: number;
  to?: string | null; // null for group chat, string for private chat
  fileType?: string;
  fileUrl?: string;
  reactions?: {
    [emoji: string]: string[]; // Array of usernames who reacted with this emoji
  };
}

export interface ReactionEvent {
  messageId: string;
  emoji: string;
  username: string;
  remove?: boolean;
}

export interface TypingEvent {
  username: string;
  isTyping: boolean;
  to?: string | null; // null for group chat, string for private chat
}
