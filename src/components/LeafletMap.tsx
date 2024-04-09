
import { FC, useEffect, useState } from "react";

import { MapContainer, TileLayer } from 'react-leaflet'

import L, { LatLngTuple } from "leaflet";

// Leaflet easy button
import "leaflet-easybutton/src/easy-button";
import "leaflet-easybutton/src/easy-button.css";

// Leaflet style
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';


interface Props { }

const LeafletMap: FC<Props> = () => {
  const [map, setMap] = useState<any>(null);
  const [position, setPosition] = useState<LatLngTuple>([0, 0]);

  useEffect(() => {
    if (!map) return;

    L.easyButton("fa-map-marker", () => {
      map.locate().on("locationfound", function (e:any) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      });
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
        </MapContainer>
      </div>
    );
}

export default LeafletMap;