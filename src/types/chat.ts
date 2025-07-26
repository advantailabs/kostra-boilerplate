import { Message, Persona, Thread, User } from '@prisma/client';

// Extended types for complex queries
export interface ThreadWithMessages extends Thread {
  messages: Message[];
  persona: Persona | null;
}

export interface ThreadWithPersona extends Thread {
  persona: Persona | null;
}

export interface PersonaWithUser extends Persona {
  user: User | null;
}

// Database operation types
export interface CreateThreadData {
  userId: number;
  personaId: number;
  title: string;
}

export interface UpdateThreadData {
  title?: string;
  personaId?: number;
}

export interface CreateMessageData {
  threadId: number;
  role: 'user' | 'assistant';
  content: string;
  openaiMessageId?: string;
}

export interface CreatePersonaData {
  userId: number;
  name: string;
  description: string;
  instructions: string;
  tags: string[];
  openaiAssistantId?: string;
  vectorStoreId?: string;
}

export interface UpdatePersonaData {
  name?: string;
  description?: string;
  instructions?: string;
  tags?: string[];
}

// API Request types
export interface CreateThreadRequest {
  personaId: number;
  message: string;
}

export interface CreatePersonaRequest {
  name: string;
  description: string;
  instructions: string;
  tags?: string[] | string;
  logo?: string;
}

export interface UpdatePersonaRequest {
  name?: string;
  description?: string;
  instructions?: string;
  tags?: string[];
  logo?: string;
}

export interface AddMessageRequest {
  content: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

export interface ThreadResponse {
  id: number;
  title: string;
  personaId: number | null;
  persona: Persona | null;
  createdAt: string;
  updatedAt: string;
}

export interface MessageResponse {
  id: number;
  threadId: number;
  role: string;
  content: string;
  timestamp: string;
}

export interface ThreadWithMessagesResponse extends ThreadResponse {
  messages: MessageResponse[];
}

export interface PersonaResponse {
  id: number;
  name: string;
  description: string;
  instructions: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Repository result types
export interface RepositoryResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Service layer types
export interface MockResponseContext {
  persona: Persona;
  userMessage: string;
  conversationHistory?: Message[];
}

export interface PresignedUrlResponse {
  presignedUrl: string;
  key: string;
  message: string;
}
