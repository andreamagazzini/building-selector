import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

import L from "leaflet";

import { faMapPin } from "@fortawesome/free-solid-svg-icons";

const LocateMeButton = () => {
  const hasBeenAdded = useRef(false);
  const map = useMap();

  useEffect(() => {
    if (!map || hasBeenAdded.current) return;

    const locateMe = () => {
      map.locate().on("locationfound", function (e: any) {
        map.setView(e.latlng).setZoom(200);
      });
    }

    // @ts-ignore
    L.Control.Button = L.Control.extend({
      options: {
        position: 'topleft'
      },
      onAdd: function () {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        var button = L.DomUtil.create('a', 'leaflet-control-button', container);
        L.DomEvent.disableClickPropagation(button);
        L.DomEvent.on(button, 'click', function () {
          locateMe()
        });

        button.innerHTML = `<svg viewBox="0 0 400 400" width="10" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="${typeof faMapPin.icon[4] === "string" ? faMapPin.icon[4] : faMapPin.icon[4].find(Boolean)}" /></svg>`

        return container;
      },
    });

    // @ts-ignore
    var control = new L.Control.Button()
    control.addTo(map);

    hasBeenAdded.current = true;
    locateMe();
  }, [map]);

  return null;
}

export default LocateMeButton;