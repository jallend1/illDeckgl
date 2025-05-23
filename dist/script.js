import { Deck } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
const INITIAL_VIEW_STATE = {
    latitude: 37.8,
    longitude: -122.45,
    zoom: 15,
};
const deckInstance = new Deck({
    initialViewState: INITIAL_VIEW_STATE,
    controller: true,
    layers: [
        new ScatterplotLayer({
            data: [{ position: [-122.45, 37.8], color: [255, 0, 0], radius: 100 }],
            getPosition: (d) => d.position,
            getFillColor: (d) => d.color,
            getRadius: (d) => d.radius,
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
