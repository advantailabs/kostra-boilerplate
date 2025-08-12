import { FileKnowledgeBase, KnowledgeBase, Message, Persona, Thread, User } from '@prisma/client';

// Public types that exclude OpenAI fields
export type PublicPersona = Omit<Persona, 'openaiAssistantId'>;
export type PublicThread = Omit<Thread, 'openaiThreadId'>;
export type PublicMessage = Omit<Message, 'openaiMessageId'>;

// Extended types for complex queries
export interface ThreadWithMessages extends Thread {
  messages: (Message & {
    messageFiles?: {
      file: { id: number; originalName: string; filename: string; mimeType: string; size: number };
    }[];
  })[];
  persona: Persona | null;
}

export interface ThreadWithPersona extends Thread {
  persona: Persona | null;
}

export interface PersonaWithUser extends Persona {
  user: User | null;
  knowledgeBase: KnowledgeBase | null;
}

// Public versions that exclude OpenAI fields
export interface PublicThreadWithMessages extends PublicThread {
  messages: (PublicMessage & {
    messageFiles?: {
      file: { id: number; originalName: string; filename: string; mimeType: string; size: number };
    }[];
  })[];
  persona: PublicPersona | null;
}

export interface PublicThreadWithPersona extends PublicThread {
  persona: PublicPersona | null;
}

export interface PublicPersonaWithUser extends PublicPersona {
  user: User | null;
  knowledgeBase: KnowledgeBase | null;
}

export interface KnowledgeBaseWithFiles extends KnowledgeBase {
  fileKnowledgeBases: (FileKnowledgeBase & {
    file: {
      id: number;
      filename: string;
      originalName: string;
      mimeType: string;
      size: number;
      url: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
  })[];
  personas: Persona[];
}

export interface PublicKnowledgeBaseWithFiles {
  id: number;
  userId: number;
  title: string;
  description: string;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  // Explicitly exclude vectorStoreId
  fileKnowledgeBases: (FileKnowledgeBase & {
    file: {
      id: number;
      filename: string;
      originalName: string;
      mimeType: string;
      size: number;
      url: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
  })[];
  personas: PublicPersona[];
}

export interface PersonaWithKnowledgeBase extends Persona {
  knowledgeBase: KnowledgeBaseWithFiles | null;
}

export interface PublicPersonaWithKnowledgeBase extends PublicPersona {
  knowledgeBase: PublicKnowledgeBaseWithFiles | null;
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

export interface CreateKnowledgeBaseData {
  userId: number;
  title: string;
  description: string;
  metadata?: any;
  vectorStoreId?: string;
}

export interface UpdateKnowledgeBaseData {
  title?: string;
  description?: string;
  metadata?: any;
  vectorStoreId?: string;
}

export interface CreatePersonaData {
  userId: number;
  name: string;
  description: string;
  instructions: string;
  tags: string[];
  logo?: string;
  openaiAssistantId?: string;
  knowledgeBaseId?: number;
}

export interface UpdatePersonaData {
  name?: string;
  description?: string;
  instructions?: string;
  tags?: string[];
  logo?: string;
  knowledgeBaseId?: number;
}

// API Request types
export interface CreateThreadRequest {
  personaId: number;
  message: string;
  files?: Array<{ originalName: string; mimeType: string; size: number; s3Key: string }>;
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

export interface CreateKnowledgeBaseRequest {
  title: string;
  description: string;
  metadata?: any;
}

export interface UpdateKnowledgeBaseRequest {
  title?: string;
  description?: string;
  metadata?: any;
}

export interface AddMessageRequest {
  content: string;
  files?: Array<{ originalName: string; mimeType: string; size: number; s3Key: string }>;
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

export interface KnowledgeBaseResponse {
  id: number;
  title: string;
  description: string;
  metadata: any;
  createdAt: string;
  updatedAt: string;
  // Explicitly exclude vectorStoreId
}

export interface PersonaResponse {
  id: number;
  name: string;
  description: string;
  instructions: string;
  tags: string[];
  knowledgeBaseId: number | null;
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

// Citation types
export interface CitationFile {
  openaiFileId: string;
  fileId: number;
  originalName: string;
  filename: string;
  mimeType: string;
  size: number;
  citationText: string; // The text that appears in the content
  startIndex: number; // Start position in the content
  endIndex: number; // End position in the content
}

export interface StoredCitation {
  openaiFileId: string;
  fileId: number;
  originalName: string;
  filename: string;
  mimeType: string;
  size: number;
  citationText: string;
  startIndex: number;
  endIndex: number;
}

// Public versions that exclude OpenAI-specific fields
export interface PublicCitationFile {
  fileId: number;
  originalName: string;
  filename: string;
  mimeType: string;
  size: number;
  citationText: string;
  startIndex: number;
  endIndex: number;
}

export interface PublicStoredCitation {
  fileId: number;
  originalName: string;
  filename: string;
  mimeType: string;
  size: number;
  citationText: string;
  startIndex: number;
  endIndex: number;
}

export interface StreamMessageResponse {
  type: 'chunk' | 'completed' | 'error';
  content?: string;
  messageId?: string;
  fullContent?: string;
  citations?: PublicCitationFile[];
  error?: string;
}
