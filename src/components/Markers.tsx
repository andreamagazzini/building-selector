import { useEffect, useState } from "react";
import {
  IMarker,
  deleteMarkerById,
  getMarkers,
  addNewMarker,
  MarkerType,
} from "../services/Firebase";
import { useMap, useMapEvents } from "react-leaflet";
import MarkerWithImage from "./MarkerWithImage";
import { LatLng } from "leaflet";

// Location Marker component
const Markers = () => {
  const [temporaryMarker, setTemporaryMarker] = useState<any>();
  const [fetchedMarkers, setFetchedMarkers] = useState<any[]>([]);

  const map = useMap();

  useEffect(() => {
    getMarkers().then((markers) => {
      setFetchedMarkers(markers);
    });
  }, []);

  const changeMarkerPosition = (position: LatLng) => {
    setTemporaryMarker({
      position: [position.lat, position.lng],
      type: MarkerType.PENDING,
    });
    getMarkers().then((markers) => {
      setFetchedMarkers(markers);
    });
  };

  useMapEvents({
    click(e) {
      changeMarkerPosition(e.latlng);
    },
  });

  map.on("geosearch/showlocation", (e: any) => {
    const position = new LatLng(e.location.y, e.location.x);
    changeMarkerPosition(position);
  });

  const onMarkerPlaced = async (marker: IMarker) => {
    if (!marker.id) return;

    await addNewMarker(marker).catch((e: any) => alert(e));
    setFetchedMarkers([...fetchedMarkers, marker]);
    setTemporaryMarker(null);
  };

  const onMarkerRemoved = async (marker: IMarker) => {
    await deleteMarkerById(marker.id);
    const [lat, lng] = marker.position;
    changeMarkerPosition(new LatLng(lat, lng));
    setFetchedMarkers(fetchedMarkers.filter((m) => marker.id !== m.id));
  };

  return (
    <>
      {[temporaryMarker, ...fetchedMarkers].filter(Boolean).map((marker) => (
        <MarkerWithImage
          key={marker.id || Math.random().toString().replace(".", "")}
          position={new LatLng(marker.position[0], marker.position[1])}
          type={marker.type}
          address={marker.address}
          id={marker.id}
          onMarkerRemoved={onMarkerRemoved}
          onMarkerPlaced={onMarkerPlaced}
        />
      ))}
    </>
  );
};

export default Markers;
