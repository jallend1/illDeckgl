import { Deck, MapViewState } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";

const INITIAL_VIEW_STATE: MapViewState = {
  latitude: 37.8,
  longitude: -122.45,
  zoom: 15,
};

type DataType = {
  position: [longitude: number, latitude: number];
  color: [r: number, g: number, b: number];
  radius: number;
};

const deckInstance = new Deck({
  initialViewState: INITIAL_VIEW_STATE,
  controller: true,
  layers: [
    new ScatterplotLayer<DataType>({
      data: [{ position: [-122.45, 37.8], color: [255, 0, 0], radius: 100 }],
      getPosition: (d: DataType) => d.position,
      getFillColor: (d: DataType) => d.color,
      getRadius: (d: DataType) => d.radius,
    }),
  ],
});

const container = document.getElementById("deck-container");
if (container) {
  const canvas = deckInstance.getCanvas?.();
  if (canvas) {
    container.appendChild(canvas);
  }
}
