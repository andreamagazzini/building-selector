import { useEffect, useState } from "react";
import { getMarkers } from "../services/Firebase";
import { useMapEvents } from "react-leaflet";
import MarkerWithImage from "./MarkerWithImage";
import { LatLng } from "leaflet";

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
        position: [e.latlng.lat, e.latlng.lng]
      })
      getMarkers().then((markers) => {
        setFetchedMarkers(markers);
      })
    },
  })

  return <>
    {
      [temporaryMarker, ...fetchedMarkers].filter(Boolean).map((marker) => (
        <MarkerWithImage 
          key={marker.id} 
          position={new LatLng(marker.position[0], marker.position[1])} 
          type={marker.type} 
          address={marker.address} 
          isTemporary={marker.id === 0} />
      ))
    }
  </>;
}

export default Markers;