
import { MapContainer, TileLayer } from 'react-leaflet'

// Leaflet geosearch
import 'leaflet-geosearch/dist/geosearch.css';

// Leaflet default compatibility (to show default icons correctly)
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

// Leaflet style
import 'leaflet/dist/leaflet.css';

import Markers from "./Markers";
import SearchBar from "./SearchBar";
import { MarkerLayer } from "react-leaflet-marker";
import LocateMeButton from "./LocateMeButton";


const LeafletMap = () => {
  return (
    <div className="App">
      <MapContainer
        center={[0,0]}
        zoom={200}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> 
            Data mining by [<a href="http://overpass-api.de/">Overpass API</a>]'
        />
        <LocateMeButton />
        <SearchBar />
        <MarkerLayer>
          <Markers />
        </MarkerLayer>
      </MapContainer>
    </div>
  );
}

export default LeafletMap;