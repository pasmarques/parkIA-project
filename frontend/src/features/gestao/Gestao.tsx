import { Layout } from '@/shared/components/Layout';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui/tabs';
import { ParkingCircle, DollarSign } from 'lucide-react';
import { Vagas } from './vagas/Vagas';
import { Tarifas } from './tarifas/Tarifas';

export default function Gestao() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie vagas e tarifas do estacionamento
          </p>
        </div>

        <Tabs defaultValue="vagas" className="space-y-6">
          <TabsList>
            <TabsTrigger value="vagas" className="gap-2">
              <ParkingCircle className="h-4 w-4" />
              Vagas
            </TabsTrigger>
            <TabsTrigger value="tarifas" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Tarifas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vagas">
            <Vagas />
          </TabsContent>

          <TabsContent value="tarifas">
            <Tarifas />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
