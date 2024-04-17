import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import MarkerWithImage from "./MarkerWithImage";


const SearchBar = () => {
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
      marker: MarkerWithImage
    });
    map.addControl(searchControl);
  }, [map]);

  return null;
};

export default SearchBar;