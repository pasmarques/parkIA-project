import { useState } from 'react';
import { Layout } from '@/shared/components/Layout';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui/tabs';
import { vagas as initialVagas, tarifas as initialTarifas } from '@/shared/services/mockData';
import { Vaga, Tarifa } from '@/shared/types/parking';
import { ParkingCircle, DollarSign } from 'lucide-react';
import { Vagas } from './vagas/Vagas';
import { Tarifas } from './tarifas/Tarifas';

export default function Gestao() {
  const [allVagas, setAllVagas] = useState<Vaga[]>(initialVagas);
  const [allTarifas, setAllTarifas] = useState<Tarifa[]>(initialTarifas);

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
            <Vagas vagas={allVagas} onUpdateVagas={setAllVagas} />
          </TabsContent>

          <TabsContent value="tarifas">
            <Tarifas tarifas={allTarifas} onUpdateTarifas={setAllTarifas} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
