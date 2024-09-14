import { useRef, useMemo, useEffect, forwardRef, useImperativeHandle, useContext } from 'react';
import { GoogleMapsContext, useMapsLibrary } from '@vis.gl/react-google-maps';

interface UsePolygonParams {
  onClick?: (event: google.maps.MapMouseEvent) => void;
  onDrag?: (event: google.maps.MapMouseEvent) => void;
  onDragStart?: (event: google.maps.MapMouseEvent) => void;
  onDragEnd?: (event: google.maps.MapMouseEvent) => void;
  onMouseOver?: (event: google.maps.MapMouseEvent) => void;
  onMouseOut?: (event: google.maps.MapMouseEvent) => void;
  coordinates: google.maps.LatLngLiteral[];
  polygonOptions?: google.maps.PolygonOptions;
}

const usePolygon = ({
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    coordinates,
    polygonOptions
}: UsePolygonParams) => {
    const callbacks = useRef({
        onClick,
        onDrag,
        onDragStart,
        onDragEnd,
        onMouseOver,
        onMouseOut
    });
    const geometryLibrary = useMapsLibrary('geometry');
    const polygon = useMemo(() => new google.maps.Polygon(), []);
    useMemo(() => {
        if(!polygonOptions) return;
        polygon.setOptions(polygonOptions);
    }, [polygon, polygonOptions]);
    const map = useContext(GoogleMapsContext)?.map;
    useMemo(() => {
        if (!coordinates || !geometryLibrary) return;
        const paths = new google.maps.MVCArray();
        // Create LatLng objects and add to MVCArray
        coordinates.forEach((coord) => {
            const latLng = new google.maps.LatLng(coord.lat, coord.lng);
            paths.push(latLng);
        });
        polygon.setPaths(paths);
    }, [polygon, coordinates, geometryLibrary]);
    // Create polygon instance and add to the map once the map is available
    useEffect(() => {
        if (!map) {
            if (map === undefined)
                console.error('<Polygon> has to be inside a Map component.');
            return;
        }

        polygon.setMap(map);

        return () => {
            polygon.setMap(null);
        };
    }, [map, polygon]);
    useEffect(() => {
        if (!polygon) return;

        // Add event listeners
        const gme = google.maps.event;
        const eventListeners = [
            gme.addListener(polygon, 'click', (e: any) => callbacks.current.onClick?.(e)),
            gme.addListener(polygon, 'drag', (e: any) => callbacks.current.onDrag?.(e)),
            gme.addListener(polygon, 'dragstart', (e: any) => callbacks.current.onDragStart?.(e)),
            gme.addListener(polygon, 'dragend', (e: any) => callbacks.current.onDragEnd?.(e)),
            gme.addListener(polygon, 'mouseover', (e: any) => callbacks.current.onMouseOver?.(e)),
            gme.addListener(polygon, 'mouseout', (e: any) => callbacks.current.onMouseOut?.(e))
        ];

        return () => {
            eventListeners.forEach(listener => gme.removeListener(listener));
            gme.clearInstanceListeners(polygon);
        };
    }, [polygon]);
    return polygon;
};

export const Polygon = forwardRef<google.maps.Polygon, UsePolygonParams>((props, ref) => {
    const polygon = usePolygon(props);
  
    useImperativeHandle(ref, () => polygon, [polygon]);
  
    return null;
});