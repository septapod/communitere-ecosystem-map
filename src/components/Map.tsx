'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Organization } from '@/types';

interface MapProps {
  organizations: Organization[];
}

// Default coordinates for USA
const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 };

export default function Map({ organizations }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView(
        [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng],
        4
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);
    }

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add markers for organizations with coordinates
    organizations.forEach((org) => {
      // Simple geocoding fallback - use default US center if no coordinates
      const lat = org.latitude || 39.8283;
      const lng = org.longitude || -98.5795;

      if (lat && lng) {
        const marker = L.marker([lat, lng], {
          title: org.organization,
        }).addTo(map.current!);

        // Popup with organization info
        marker.bindPopup(`
          <div style="max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">
              ${org.organization}
            </h3>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">
              <strong>Type:</strong> ${org.type}
            </p>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">
              <strong>Location:</strong> ${org.location}
            </p>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">
              <strong>Scope:</strong> ${org.scope}
            </p>
            <p style="margin: 0 0 8px 0; font-size: 12px;">
              ${org.description.substring(0, 100)}...
            </p>
            ${org.website ? `<a href="https://${org.website}" target="_blank" rel="noopener noreferrer" style="color: #0066cc; font-size: 12px;">Visit Website →</a>` : ''}
          </div>
        `);

        markers.current.push(marker);
      }
    });

    // Auto-fit map to markers if there are any
    if (markers.current.length > 0) {
      const group = new L.FeatureGroup(markers.current);
      map.current?.fitBounds(group.getBounds().pad(0.1));
    }
  }, [organizations]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}
