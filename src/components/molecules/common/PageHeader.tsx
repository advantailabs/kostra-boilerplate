interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="relative flex-shrink-0 border-border px-4 py-3">
      <div>
        <h1 className="text-lg font-medium text-text">{title}</h1>
        {description && <p className="text-xs text-text-muted">{description}</p>}
      </div>
    </div>
  );
}
