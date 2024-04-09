
import { useEffect, useRef, useState } from "react";

import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet'

import L, { LatLngTuple } from "leaflet";

import MarkerWithImage from "./MarkerWithImage";

// Leaflet geosearch
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

// Leaflet default compatibility (to show default icons correctly)
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

// Leaflet style
import 'leaflet/dist/leaflet.css';

const SearchField = () => {
  let hasBeenAdded = useRef(false);
  const map = useMap();

  useEffect(() => {
    if (hasBeenAdded.current) {
      return;
    }
    hasBeenAdded.current = true
    const provider = new OpenStreetMapProvider();
    // @ts-ignore
    const searchControl = new GeoSearchControl({
      provider: provider,
    });
    map.addControl(searchControl);
  }, [map]);

  return null;
};



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
        <SearchField />
        <LocationMarker />
      </MapContainer>
    </div>
  );
}

export default LeafletMap;