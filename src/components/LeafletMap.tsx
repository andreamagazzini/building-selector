
import { useEffect, useState } from "react";

import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'

import L, { LatLngTuple } from "leaflet";

// Leaflet easy button
import "leaflet-easybutton/src/easy-button";
import "leaflet-easybutton/src/easy-button.css";

// Leaflet style
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import MarkerWithImage from "./MarkerWithImage";

// Location Marker component
const LocationMarker = () => {
  const [markers, setMarkers] = useState<any[]>([]);
  

  useMapEvents({
    click(e) {
      setMarkers([...markers, <MarkerWithImage position={e.latlng} />])
    },
  })

  return <>
    {
      markers.map((el) => el)
    }
  </>;
}

const LeafletMap = () => {
  const [map, setMap] = useState<any>(null);
  const [position, setPosition] = useState<LatLngTuple>([0, 0]);

  useEffect(() => {
    if (!map) return;

    const locateMe = () => {
      map.locate().on("locationfound", function (e: any) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      });
    }

    locateMe();

    L.easyButton("fa-map-marker", () => {
      locateMe()
    }).addTo(map);
  }, [map]);

  
  return (
    <div className="App">
      <MapContainer
        center={position}
        zoom={200}
        ref={setMap}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> 
            Data mining by [<a href="http://overpass-api.de/">Overpass API</a>]'
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
}

export default LeafletMap;