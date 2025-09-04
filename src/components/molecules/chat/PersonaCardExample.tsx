import { PublicPersona } from '@/types/chat';
import { PersonaCard } from './PersonaCard';

// Example personas for demonstration
const examplePersonas: PublicPersona[] = [
  {
    id: 1,
    userId: 1,
    name: 'Marketing Assistant',
    description:
      'You are a professional marketing assistant specialized in content creation, social media strategies, and campaign optimization. I help create engaging content, analyze market trends, and optimize marketing campaigns for maximum ROI.',
    instructions: 'Help with marketing tasks and content creation.',
    tags: ['Marketing', 'Content', 'Social Media'],
    logo: null,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    userId: 1,
    name: 'Code Review Expert',
    description:
      'I am a senior software engineer with expertise in code review, best practices, and software architecture. I help identify bugs, suggest improvements, and ensure code quality across multiple programming languages.',
    instructions: 'Help with code review and software development.',
    tags: ['Development', 'Code Review'],
    logo: null,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function PersonaCardExample() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Persona Card Examples
        </h2>
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
