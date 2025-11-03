'use client';

import dynamic from 'next/dynamic';
import { Card, CardBody } from '@nextui-org/react';
import { Organization } from '@/types';

// Dynamically import the map to avoid SSR issues with Leaflet
const DynamicMap = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <Card className="h-full">
      <CardBody className="flex items-center justify-center h-full">
        <p className="text-gray-600">Loading map...</p>
      </CardBody>
    </Card>
  ),
});

interface MapViewProps {
  organizations: Organization[];
}

export function MapView({ organizations }: MapViewProps) {
  return <DynamicMap organizations={organizations} />;
}
