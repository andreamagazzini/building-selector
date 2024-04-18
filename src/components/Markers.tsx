import { useEffect, useState } from "react";
import { IMarker, deleteMarkerById, getMarkers } from "../services/Firebase";
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
    })
  }, [])

  const changeMarkerPosition = (position: LatLng) => {
    console.log(position);
    setTemporaryMarker({
      id: "0",
      position: [position.lat, position.lng]
    })
    getMarkers().then((markers) => {
      setFetchedMarkers(markers);
    })
  }

  useMapEvents({
    click(e) {
      changeMarkerPosition(e.latlng);
    },
  })

  map.on('geosearch/showlocation', (e: any) => {
    const position = new LatLng(e.location.y, e.location.x);
    changeMarkerPosition(position)
  })

  const onMarkerRemoved = async (marker: IMarker) => {
    await deleteMarkerById(marker.id);

    setTemporaryMarker({
      id: "0",
      position: marker.position
    })
  }

  return <>
    {
      [temporaryMarker, ...fetchedMarkers].filter(Boolean).map((marker) => (
        <MarkerWithImage
          key={marker.id}
          position={new LatLng(marker.position[0], marker.position[1])}
          type={marker.type}
          address={marker.address}
          id={marker.id}
          onMarkerRemoved={onMarkerRemoved}
        />
      ))
    }
  </>;
}

export default Markers;