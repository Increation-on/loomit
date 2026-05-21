interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">📭</div>
      <h2 className="text-xl font-semibold text-loom-white mb-2">{title}</h2>
      {description && <p className="text-loom-white/60">{description}</p>}
    </div>
  );
}