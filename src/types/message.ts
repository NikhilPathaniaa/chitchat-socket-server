export interface Reaction {
  emoji: string;
  from: string;
}

export interface Message {
  id: string;
  content: string;
  message?: string;
  from: string;
  to?: string | null;  // Make it optional and nullable
  timestamp: number;
  reactions?: Reaction[];  // Make reactions optional
  fileData?: string;
  fileType?: string;
  fileName?: string;
}
