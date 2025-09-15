'use client';

import { useState } from 'react';
import { Technology, TechnologyHistory } from '@/app/radar/page';
import TechnologyRadar from './TechnologyRadar';
import RadarManagement from './RadarManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RadarWrapperProps {
  technologies: Technology[];
  history: TechnologyHistory[];
}

export default function RadarWrapper({ technologies: initialTechnologies, history }: RadarWrapperProps) {
  const [technologies, setTechnologies] = useState<Technology[]>(initialTechnologies);

  const refreshData = async () => {
    const res = await fetch('/api/radar/technologies');
    const data = await res.json();
    setTechnologies(data);
  };

  return (
    <Tabs defaultValue="radar" className="w-full">
      <TabsList>
        <TabsTrigger value="radar">Radar View</TabsTrigger>
        <TabsTrigger value="manage">Manage Entries</TabsTrigger>
      </TabsList>
      <TabsContent value="radar">
        <TechnologyRadar technologies={technologies} />
      </TabsContent>
      <TabsContent value="manage">
        <RadarManagement technologies={technologies} history={history} onDataChange={refreshData} />
      </TabsContent>
    </Tabs>
  );
}
