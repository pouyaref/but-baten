// src/types.ts

export interface Message {
  id: string;
  role: 'user' | 'bot' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface SearchResult {
  title: string;
  content: string;
  source: string;
  url?: string;
  relevance?: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}