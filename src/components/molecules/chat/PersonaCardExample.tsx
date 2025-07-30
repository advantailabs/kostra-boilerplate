import { PersonaWithKnowledgeBase } from '@/types/chat';
import { PersonaCard } from './PersonaCard';

// Example personas for demonstration
const examplePersonas: PersonaWithKnowledgeBase[] = [
  {
    id: 1,
    userId: 1,
    openaiAssistantId: 'asst_example1',
    knowledgeBaseId: 1,
    name: 'Marketing Assistant',
    description:
      'You are a professional marketing assistant specialized in content creation, social media strategies, and campaign optimization. I help create engaging content, analyze market trends, and optimize marketing campaigns for maximum ROI.',
    instructions: 'Help with marketing tasks and content creation.',
    tags: ['Marketing', 'Content', 'Social Media'],
    logo: null,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    knowledgeBase: {
      id: 1,
      userId: 1,
      title: 'Marketing Knowledge Base',
      description: 'Knowledge base for marketing assistant',
      metadata: {},
      vectorStoreId: 'vs_example1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      fileKnowledgeBases: [
        {
          id: 1,
          fileId: 1,
          knowledgeBaseId: 1,
          createdAt: new Date(),
          file: {
            id: 1,
            filename: 'marketing_guide.pdf',
            originalName: 'Marketing Guide.pdf',
            mimeType: 'application/pdf',
            size: 1024000,
            url: 'https://example.com/marketing_guide.pdf',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        {
          id: 2,
          fileId: 2,
          knowledgeBaseId: 1,
          createdAt: new Date(),
          file: {
            id: 2,
            filename: 'campaign_data.xlsx',
            originalName: 'Campaign Data.xlsx',
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            size: 512000,
            url: 'https://example.com/campaign_data.xlsx',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ],
      personas: [],
    },
  },
  {
    id: 2,
    userId: 1,
    openaiAssistantId: 'asst_example2',
    knowledgeBaseId: 2,
    name: 'Code Review Expert',
    description:
      'I am a senior software engineer with expertise in code review, best practices, and software architecture. I help identify bugs, suggest improvements, and ensure code quality across multiple programming languages.',
    instructions: 'Help with code review and software development.',
    tags: ['Development', 'Code Review'],
    logo: null,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    knowledgeBase: {
      id: 2,
      userId: 1,
      title: 'Code Review Knowledge Base',
      description: 'Knowledge base for code review expert',
      metadata: {},
      vectorStoreId: 'vs_example2',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      fileKnowledgeBases: [
        {
          id: 3,
          fileId: 3,
          knowledgeBaseId: 2,
          createdAt: new Date(),
          file: {
            id: 3,
            filename: 'coding_standards.pdf',
            originalName: 'Coding Standards.pdf',
            mimeType: 'application/pdf',
            size: 256000,
            url: 'https://example.com/coding_standards.pdf',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ],
      personas: [],
    },
  },
];

export function PersonaCardExample() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Persona Card Examples
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {examplePersonas.map(persona => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              onEdit={() => console.log('Edit:', persona.name)}
              onDelete={() => console.log('Delete:', persona.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
