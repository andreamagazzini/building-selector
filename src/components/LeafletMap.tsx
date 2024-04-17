
import { useEffect, useState } from "react";

import { MapContainer, TileLayer } from 'react-leaflet'

import { LatLngTuple } from "leaflet";

import SearchBar from "./SearchBar";

// Leaflet geosearch
import 'leaflet-geosearch/dist/geosearch.css';

// Leaflet default compatibility (to show default icons correctly)
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

// Leaflet style
import 'leaflet/dist/leaflet.css';
import Markers from "./Markers";


const LeafletMap = () => {
  const [map, setMap] = useState<any>(null);
  const [position, setPosition] = useState<LatLngTuple>([0, 0]);

  useEffect(() => {
    if (!map) return;

    const locateMe = () => {
      map.locate().on("locationfound", function (e: any) {
        setPosition(e.latlng);
        map.setView(e.latlng);
      });
    }

    locateMe();
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
        <SearchBar />
        <Markers />
      </MapContainer>
    </div>
  );
}

export default LeafletMap;