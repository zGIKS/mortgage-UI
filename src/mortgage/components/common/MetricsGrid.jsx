import { cn } from '@/lib/utils';

const defaultAccents = [
  'text-primary',
  'text-primary',
  'text-secondary',
  'text-secondary',
  'text-destructive',
  'text-primary',
  'text-primary',
  'text-secondary',
  'text-muted-foreground',
];

const MetricsGrid = ({ metrics = [], accents = defaultAccents, className }) => (
  <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
    {metrics.map((metric, index) => (
      <div key={metric.label} className="rounded-xl border border-border/60 bg-card/80 p-4">
        <p className="text-sm text-muted-foreground">{metric.label}</p>
        <p className={cn('text-2xl font-semibold', metric.accent || accents[index % accents.length])}>
          {metric.value}
        </p>
      </div>
    ))}
  </div>
);

export default MetricsGrid;
