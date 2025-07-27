import { PersonaCard } from './PersonaCard';

// Example personas for demonstration
const examplePersonas = [
  {
    id: '1',
    name: 'Marketing Assistant',
    description:
      'You are a professional marketing assistant specialized in content creation, social media strategies, and campaign optimization. I help create engaging content, analyze market trends, and optimize marketing campaigns for maximum ROI.',
    tags: ['Marketing', 'Content', 'Social Media'],
    logo: null,
    fileCount: 5,
    fileTypes: ['PDF', 'Excel', 'Document', 'Image'],
  },
  {
    id: '2',
    name: 'Code Review Expert',
    description:
      'I am a senior software engineer with expertise in code review, best practices, and software architecture. I help identify bugs, suggest improvements, and ensure code quality across multiple programming languages.',
    tags: ['Development', 'Code Review'],
    logo: null,
    fileCount: 3,
    fileTypes: ['Document', 'PDF'],
  },
  {
    id: '3',
    name: 'Data Analyst',
    description:
      'Specialized in data analysis, visualization, and insights generation. I help interpret complex datasets, create meaningful visualizations, and provide actionable business insights.',
    tags: ['Data', 'Analytics', 'Visualization'],
    logo: null,
    fileCount: 7,
    fileTypes: ['Excel', 'Document', 'Image', 'PDF'],
  },
  {
    id: '4',
    name: 'Fitness & Nutrition Coach',
    description:
      'Identifying if skills fits or not. I help create personalized fitness plans, nutrition guidance, and wellness strategies to achieve health goals effectively.',
    tags: ['Fitness', 'Nutrition', 'Wellness'],
    logo: null,
    fileCount: 1,
    fileTypes: ['Document'],
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
              persona={persona as any}
              onEdit={() => console.log('Edit:', persona.name)}
              onDelete={() => console.log('Delete:', persona.name)}
              fileCount={persona.fileCount}
              fileTypes={persona.fileTypes}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
