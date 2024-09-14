import { useEffect } from 'react';

export function useDrawingManagerEvents(drawingManager, onDrawingComplete, updateCallback) {
  useEffect(() => {
    if (!drawingManager) return;
    const listeners = [];
    const overlayCompleteListener = google.maps.event.addListener(
      drawingManager,
      'overlaycomplete',
      (event) => {
        const overlay = event.overlay;
        let overlayData = {};
        overlayData = {
          type: 'polygon',
          paths: overlay.getPath().getArray().map((latLng) => latLng.toJSON()),
        };
        listeners.push(google.maps.event.addListener(overlay, 'path_changed', () => updateCallback(overlay.getPath().getArray().map((latLng) => latLng.toJSON()))));
      }
    );

    return () => {
        google.maps.event.removeListener(overlayCompleteListener);
        listeners.forEach((listener) => google.maps.event.removeListener(listener));
    };
  }, [drawingManager, onDrawingComplete]);
}