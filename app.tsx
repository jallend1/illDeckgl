// deck.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import React from "react";
import { createRoot } from "react-dom/client";
import { Map } from "react-map-gl/maplibre";
import { AmbientLight, PointLight, LightingEffect } from "@deck.gl/core";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import { DeckGL } from "@deck.gl/react";
import { CSVLoader } from "@loaders.gl/csv";
import { load } from "@loaders.gl/core";

import type { Color, PickingInfo, MapViewState } from "@deck.gl/core";

import { ScatterplotLayer } from "@deck.gl/layers";

// Source data CSV
// const DATA_URL =
//   'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv';

const DATA_URL = "./data/withCoordinates.csv";

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});

const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-0.144528, 49.739968, 80000],
});

const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000],
});

const lightingEffect = new LightingEffect({
  ambientLight,
  pointLight1,
  pointLight2,
});

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -122.3321,
  latitude: 47.6062,
  zoom: 5,
  minZoom: 3,
  maxZoom: 15,
  pitch: 40.5,
  bearing: -27,
};

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

export const colorRange: Color[] = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78],
];

function getTooltip({ object }: PickingInfo) {
  if (!object) {
    return null;
  }
  const lat = object.position[1];
  const lng = object.position[0];
  const count = object.count;

  return `\
    latitude: ${Number.isFinite(lat) ? lat.toFixed(6) : ""}
    longitude: ${Number.isFinite(lng) ? lng.toFixed(6) : ""}
    ${count} Accidents`;
}

type DataPoint = [longitude: number, latitude: number];

export default function App({
  data = null,
  mapStyle = MAP_STYLE,
  radius = 1000,
  upperPercentile = 100,
  coverage = 1,
}: {
  data?: DataPoint[] | null;
  mapStyle?: string;
  radius?: number;
  upperPercentile?: number;
  coverage?: number;
}) {
  const layers =
    data && data.length > 0
      ? [
          new HexagonLayer<DataPoint>({
            id: "heatmap",
            pickable: false,
            gpuAggregation: true,
            colorRange,
            coverage,
            data,
            elevationRange: [0, 3000],
            elevationScale: 50,
            extruded: true,
            getPosition: (d) => d,
            radius: 2000,
            upperPercentile,
            material: {
              ambient: 0.64,
              diffuse: 0.6,
              shininess: 32,
              specularColor: [51, 51, 51],
            },
            transitions: {
              elevationScale: 3000,
            },
          }),
        ]
      : [];

  return (
    <DeckGL
      layers={layers}
      effects={[lightingEffect]}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      getTooltip={getTooltip}
    >
      <Map reuseMaps mapStyle={mapStyle} />
    </DeckGL>
  );
}
export async function renderToDOM(container: HTMLDivElement) {
  const root = createRoot(container);

  const data = (await load(DATA_URL, CSVLoader)).data;
  const points: DataPoint[] = data
    .map((d: any) => {
      const lon = Number(d.longitude);
      const lat = Number(d.latitude);
      if (
        Number.isFinite(lon) &&
        Number.isFinite(lat) &&
        lon !== 0 &&
        lat !== 0
      ) {
        return [lon, lat];
      }
      return null;
    })
    .filter(Boolean) as DataPoint[];

  root.render(<App data={points} />);
}
