interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="relative flex-shrink-0 border-gray-200 px-4 py-3 dark:border-gray-700">
      <div>
        <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h1>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
    </div>
  );
}
