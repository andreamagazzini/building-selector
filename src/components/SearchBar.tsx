import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";


const SearchBar = () => {
  const hasBeenAdded = useRef(false);
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
      showMarker: false,
      showPopup: false
    });
    map.addControl(searchControl);
  }, [map]);

  return null;
};

export default SearchBar;