import { Header } from '@/shared/components/Header';
import { Sidebar } from '@/shared/components/Sidebar';
import { cn } from '@/lib/utils';

const MortgagePageLayout = ({
  children,
  title,
  subtitle,
  description,
  actions,
  header,
  mainClassName,
}) => {
  const renderHeader = () => {
    if (header === null) {
      return null;
    }

    if (header) {
      return header;
    }

    if (!title && !subtitle && !description && !actions) {
      return null;
    }

    return (
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          {title && <h1 className="text-3xl font-semibold text-foreground">{title}</h1>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main className={cn('lg:ml-72 px-4 sm:px-6 lg:px-10 py-10 space-y-8', mainClassName)}>
        {renderHeader()}
        {children}
      </main>
    </div>
  );
};

export default MortgagePageLayout;
