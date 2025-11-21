import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const MortgageHistoryCard = ({ title, subtitle, currency, fields = [], actions }) => (
  <Card>
    <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </div>
      {currency && (
        <Badge variant="secondary" className="w-fit">
          {currency}
        </Badge>
      )}
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="text-muted-foreground">{field.label}</p>
            <p className="font-semibold text-foreground">{field.value}</p>
          </div>
        ))}
      </div>
      {actions && (
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          {actions.map((action) => (
            <Button key={action.label} variant={action.variant} className={action.className} onClick={action.onClick}>
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

export default MortgageHistoryCard;
