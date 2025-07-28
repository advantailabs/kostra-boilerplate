import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface CreateFileParams {
  file: File;
  purpose: 'assistants' | 'fine-tune';
}

export interface FileServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Creates a new file in OpenAI
 */
export const createFile = async (
  params: CreateFileParams
): Promise<FileServiceResult<OpenAI.Files.FileObject>> => {
  try {
    const file = await openai.files.create({
      file: params.file,
      purpose: params.purpose,
    });

    return {
      success: true,
      data: file,
    };
  } catch (error) {
    console.error('Error creating OpenAI file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create file',
    };
  }
};

/**
 * Retrieves a file by ID
 */
export const getFile = async (
  fileId: string
): Promise<FileServiceResult<OpenAI.Files.FileObject>> => {
  try {
    const file = await openai.files.retrieve(fileId);

    return {
      success: true,
      data: file,
    };
  } catch (error) {
    console.error('Error retrieving OpenAI file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve file',
    };
  }
};

/**
 * Deletes a file by ID
 */
export const deleteFile = async (
  fileId: string
): Promise<FileServiceResult<{ deleted: boolean; id: string }>> => {
  try {
    const result = await openai.files.delete(fileId);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error deleting OpenAI file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete file',
    };
  }
};

/**
 * Lists all files
 */
export const listFiles = async (
  purpose?: string,
  after?: string,
  limit: number = 20
): Promise<FileServiceResult<OpenAI.Files.FileObjectsPage>> => {
  try {
    const params: any = { limit };
    if (purpose) params.purpose = purpose;
    if (after) params.after = after;

    const files = await openai.files.list(params);

    return {
      success: true,
      data: files,
    };
  } catch (error) {
    console.error('Error listing OpenAI files:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list files',
    };
  }
};

/**
 * Downloads file content
 */
export const downloadFile = async (fileId: string): Promise<FileServiceResult<string>> => {
  try {
    const content = await openai.files.content(fileId);
    const text = await content.text();

    return {
      success: true,
      data: text,
    };
  } catch (error) {
    console.error('Error downloading OpenAI file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to download file',
    };
  }
};
