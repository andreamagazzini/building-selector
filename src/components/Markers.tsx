import { useEffect, useState } from "react";
import { getMarkers } from "../services/Firebase";
import { useMapEvents } from "react-leaflet";
import MarkerWithImage from "./MarkerWithImage";

// Location Marker component
const Markers = () => {
  const [temporaryMarker, setTemporaryMarker] = useState<any>();
  const [fetchedMarkers, setFetchedMarkers] = useState<any[]>([]);

  useEffect(() => {
    getMarkers().then((markers) => {
      setFetchedMarkers(markers);
    })
  }, [])

  useMapEvents({
    click(e) {
      setTemporaryMarker({
        id: 0,
        position: e.latlng
      })
      getMarkers().then((markers) => {
        setFetchedMarkers(markers);
      })
    },
  })

  return <>
    {
      [temporaryMarker, ...fetchedMarkers].filter(Boolean).map((marker, index) => (
        <MarkerWithImage key={marker.id} position={marker.position} type={marker.type} address={marker.address} isTemporary={marker.id === 0} />
      ))
    }
  </>;
}

export default Markers;