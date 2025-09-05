import { Persona, User } from '@prisma/client';
import { UploadPurpose } from './file-upload';

// Public types that exclude OpenAI fields
export type PublicPersona = Omit<Persona, 'openaiAssistantId'>;

// Unified file attachment type used in requests
export interface UploadedFile {
  originalName: string;
  mimeType: string;
  size: number;
  s3Key: string;
  uploadPurpose?: UploadPurpose;
}

// Extended types for complex queries
export interface PersonaWithUser extends Persona {
  user: User | null;
}

// Public versions that exclude OpenAI fields
export interface PublicPersonaWithUser extends PublicPersona {
  user: User | null;
}

// Database operation types
export interface CreatePersonaData {
  userId: number;
  name: string;
  description: string;
  instructions: string;
  tags: string[];
  logo?: string;
}

export interface UpdatePersonaData {
  name?: string;
  description?: string;
  instructions?: string;
  tags?: string[];
  logo?: string;
}

// API Request types
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
}

// Citation types
export interface CitationFile {
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
