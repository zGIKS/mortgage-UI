import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Landmark } from 'lucide-react';
import { bankRatesService } from '../api/bankRatesService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MortgagePageLayout from '../../mortgage/components/layout/MortgagePageLayout';

const BanksPage = () => {
  const { t } = useTranslation('bank');
  const [loading, setLoading] = useState(true);
  const [bankData, setBankData] = useState(null);

  useEffect(() => {
    const fetchBankRates = async () => {
      setLoading(true);
      try {
        const data = await bankRatesService.getMNRates();
        console.log('Bank rates data:', data);
        setBankData(data);
      } catch (error) {
        console.error('Error fetching bank rates:', error);
        toast.error(t('banks.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchBankRates();
  }, [t]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-64 items-center justify-center">
          <span className="text-muted-foreground">{t('banks.loading')}</span>
        </div>
      );
    }

    if (!bankData || bankData.banks.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-muted-foreground">{t('banks.noData')}</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {/* Información de la fecha */}
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            <strong>{t('banks.lastUpdate')}:</strong> {bankData.formattedDate}
          </p>
        </div>

        {/* Grid de tarjetas de bancos */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bankData.banks.map((bank) => (
            <Card
              key={bank.name}
              className="overflow-hidden transition-all hover:shadow-lg hover:border-primary/50"
            >
              <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Landmark className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{bank.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="text-center">
                    {bank.rate !== null ? (
                      <>
                        <div className="text-4xl font-bold text-primary">
                          {bank.rate.toFixed(2)}%
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {t('banks.card.rate')} {t('banks.card.annual')}
                        </p>
                      </>
                    ) : (
                      <div className="text-muted-foreground">
                        {t('banks.card.noRate')}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Nota informativa */}
        {bankData.note && (
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">
              {t('banks.note')}
            </p>
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              {t('banks.source')}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <MortgagePageLayout
      title={t('banks.title')}
      subtitle={t('banks.subtitle')}
    >
      {renderContent()}
    </MortgagePageLayout>
  );
};

export { BanksPage };
export default BanksPage;
