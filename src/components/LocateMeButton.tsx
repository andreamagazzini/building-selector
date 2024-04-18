import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

import L from "leaflet";

// Leaflet easy button
import "leaflet-easybutton/src/easy-button";
import "leaflet-easybutton/src/easy-button.css";

import { faLocationPin } from "@fortawesome/free-solid-svg-icons";

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

        container.title = "Title";
        button.innerHTML = `<svg viewBox="0 0 500 700" width="10" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="${typeof faLocationPin.icon[4] === "string" ? faLocationPin.icon[4] : faLocationPin.icon[4].find(Boolean)}" /></svg>`

        return container;
      },
      onRemove: function () { },
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