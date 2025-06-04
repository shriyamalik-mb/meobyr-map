
// src/components/AvailabilityMap.jsx

import React, { useState, useMemo } from 'react';
import { DeckGL } from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { availabilityData } from '../data/availabilityData';
import { coordinates } from '../data/coordinates';
import { getIntensityColor } from '../utils/colorScaleAvail';

const INITIAL_VIEW_STATE = {
  longitude: 55.3,
  latitude: 25.2,
  zoom: 9,
  pitch: 0,
  bearing: 0,
};

export default function AvailabilityMap({ selectedDate }) {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  // Build data for exactly selectedDate
  const data = useMemo(() => {
    if (!selectedDate) return [];
    const record = availabilityData.find((rec) => rec.date === selectedDate);
    if (!record) return [];

    return Object.entries(record.values)
      .map(([locName, intensity]) => {
        const coord = coordinates[locName];
        if (!coord) return null;
        return {
          position: [coord.lng, coord.lat],
          value: intensity, // 0–1
        };
      })
      .filter((d) => d !== null);
  }, [selectedDate]);

  const scatterLayer = useMemo(
    () =>
      new ScatterplotLayer({
        id: 'availability-scatter-layer',
        data,
        pickable: true,
        radiusUnits: 'meters',
        getPosition: (d) => d.position,
        getFillColor: (d) => getIntensityColor(d.value),
        getRadius: 2000,
        opacity: 0.8,
        onHover: ({ object, x, y }) => {
          /* 
            object.value is the intensity at this location for selectedDate 
            You could display a tooltip here if needed.
          */
        },
      }),
    [data]
  );

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState: vs }) => setViewState(vs)}
        controller={true}
        layers={[scatterLayer]}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      >
        <Map
          {...viewState}
          onMove={({ viewState: vs }) => setViewState(vs)}
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        />
      </DeckGL>
    </div>
  );
}
