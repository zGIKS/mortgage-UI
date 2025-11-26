import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calculator, Building2, Landmark, ArrowRight } from 'lucide-react';
import { authService } from '../iam/application/auth-service';
import { Header } from '../shared/components/Header';
import { Sidebar } from '../shared/components/Sidebar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const mockProperties = [
  {
    id: 'home-1',
    title: 'Casa familiar en Miraflores',
    location: 'Lima, Perú',
    description: 'Espacios abiertos, luz natural y lista para mudarte.',
    highlights: ['3 habitaciones', '2 baños', '1 estacionamiento'],
    data: {
      precio_venta: 250000,
      cuota_inicial: 50000,
      monto_prestamo: 200000,
      bono_techo_propio: 15000,
      tasa_anual: 0.1,
      tipo_tasa: 'EFFECTIVE',
      frecuencia_pago: 30,
      dias_anio: 360,
      plazo_meses: 240,
      meses_gracia: 12,
      tipo_gracia: 'PARTIAL',
      moneda: 'PEN',
      tasa_descuento: 0.08,
    },
  },
  {
    id: 'home-2',
    title: 'Departamento céntrico en Surco',
    location: 'Lima, Perú',
    description: 'Ideal para inversión o primera vivienda.',
    highlights: ['2 habitaciones', 'Balcón', 'Pet friendly'],
    data: {
      precio_venta: 180000,
      cuota_inicial: 30000,
      monto_prestamo: 150000,
      bono_techo_propio: 10000,
      tasa_anual: 0.12,
      tipo_tasa: 'NOMINAL',
      frecuencia_pago: 30,
      dias_anio: 360,
      plazo_meses: 180,
      meses_gracia: 0,
      tipo_gracia: 'NONE',
      moneda: 'PEN',
      tasa_descuento: 0.1,
    },
  },
];

const formatCurrency = (value, currency = 'PEN') =>
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const buildSearchParams = (data) => {
  const params = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, value.toString());
    }
  });
  return params.toString();
};

export function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation('shared');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />

      <main className="lg:ml-72 px-4 sm:px-6 lg:px-10 py-10">
        <section className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('dashboard.properties.subtitle')}</p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                {t('dashboard.properties.title')}
              </h2>
            </div>
            <Button variant="outline" onClick={() => navigate('/mortgage/calculator')}>
              <Calculator className="mr-2 h-4 w-4" />
              {t('dashboard.properties.cta')}
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {mockProperties.map((property) => {
              const query = buildSearchParams(property.data);
              const goToCalculator = () => navigate(`/mortgage/calculator?${query}`);
              const goToBanks = () => navigate(`/banks?${query}`);

              return (
                <Card key={property.id} className="border-border/70 bg-card/90 shadow-sm">
                  <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <Building2 className="h-5 w-5 text-primary" />
                          {property.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-muted-foreground">
                          <Landmark className="h-4 w-4" />
                          {property.location}
                        </CardDescription>
                      </div>
                      {property.data.bono_techo_propio > 0 && (
                        <Badge variant="secondary">
                          {t('dashboard.properties.bonus', {
                            amount: formatCurrency(property.data.bono_techo_propio, property.data.moneda),
                          })}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{property.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {property.highlights.map((item) => (
                        <Badge key={item} variant="outline" className="border-border/70">
                          {item}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg border border-border/70 bg-muted/40 p-3">
                        <p className="text-muted-foreground">{t('dashboard.properties.price')}</p>
                        <p className="text-lg font-semibold text-foreground">
                          {formatCurrency(property.data.precio_venta, property.data.moneda)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border/70 bg-muted/40 p-3">
                        <p className="text-muted-foreground">{t('dashboard.properties.rate')}</p>
                        <p className="text-lg font-semibold text-foreground">
                          {(property.data.tasa_anual * 100).toFixed(2)}% {property.data.tipo_tasa}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border/70 bg-muted/40 p-3">
                        <p className="text-muted-foreground">{t('dashboard.properties.term')}</p>
                        <p className="text-lg font-semibold text-foreground">
                          {property.data.plazo_meses} {t('dashboard.properties.months')}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border/70 bg-muted/40 p-3">
                        <p className="text-muted-foreground">{t('dashboard.properties.currency')}</p>
                        <p className="text-lg font-semibold text-foreground">{property.data.moneda}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <Button className="w-full sm:w-auto" onClick={goToBanks} variant="secondary">
                        {t('dashboard.properties.chooseBank')}
                      </Button>
                      <Button className="w-full sm:w-auto" onClick={goToCalculator}>
                        {t('dashboard.properties.simulate')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
