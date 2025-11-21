import { cn } from '@/lib/utils';

const KeyValueGrid = ({ items = [], className }) => (
  <div className={cn('grid gap-4 text-sm md:grid-cols-2', className)}>
    {items.map((item) => (
      <div key={item.label} className="flex justify-between border-b border-border/50 pb-2">
        <span className="text-muted-foreground">{item.label}</span>
        <span className="font-semibold text-foreground text-right">{item.value}</span>
      </div>
    ))}
  </div>
);

export default KeyValueGrid;
