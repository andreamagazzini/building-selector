import { ChangeEventHandler, FC, useEffect, useState } from "react";
import { IMarker, MarkerType, addNewMarker } from "../services/Firebase";
import { LatLng, divIcon } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { faLocationPin } from "@fortawesome/free-solid-svg-icons";

interface Props {
  position: LatLng,
  id?: string,
  address?: string,
  type?: MarkerType,
  onMarkerRemoved: (marker: IMarker) => void
}

const MarkerWithImage: FC<Props> = ({ position, address, type, id = "0", onMarkerRemoved }) => {
  const [image, setImage] = useState("");
  const [fetchedAddress, setFetchedAddress] = useState(address || `${position.lat}, ${position.lng}`);
  const [fetchedId, setFetchedId] = useState<string>(id);

  useEffect(() => {
    if (id !== "0") return;

    const reverseGeocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&zoom=18&addressdetails=1`;
    fetch(reverseGeocodingUrl)
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        setFetchedAddress(responseJson.display_name)
        setFetchedId(responseJson.place_id.toString())
      })
      .catch(error => console.log('Reverse Geocode', error));
  }, [position, id])

  const onImageChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target;
    if (target.files && target.files[0]) {
      let img = target.files[0];
      setImage(URL.createObjectURL(img));
    }
  }

  const onMarkerPlaced = async () => {
    if (!id) return;

    await addNewMarker({
      id: fetchedId,
      position: [position.lat, position.lng],
      address: fetchedAddress,
      type: MarkerType.DONE
    }).catch((e) => alert(e))

    setFetchedId("0");
  }

  return (
    <Marker
      position={position}
      icon={divIcon({ html: `<svg fill="${type === MarkerType.DONE ? "green" : "blue"}" style="margin-left:-10px;margin-top:-10px" viewBox="0 0 500 700" width="40" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="${typeof faLocationPin.icon[4] === "string" ? faLocationPin.icon[4] : faLocationPin.icon[4].find(Boolean)}" /></svg>` })}
    >
      <Popup>
        <div className="flex flex-col gap-5 p-5">
        <span>{fetchedAddress}</span>
        {
          image &&
          <img width="200" alt="uploaded" src={image} />
        }
        <input type="file" name="myImage" onChange={onImageChange} />
        {
          id === "0" && fetchedId !== "0" ? 
          <button className="bg-green-700 text-white p-3 rounded-xl" onClick={onMarkerPlaced}>Place</button>
          :
          <button className="bg-red-700 text-white p-3 rounded-xl" onClick={() => onMarkerRemoved({position: [position.lat, position.lng], id: fetchedId, address: fetchedAddress, type: type || MarkerType.DONE })}>Remove</button>
        }
        </div>
      </Popup>
    </Marker>
  )
}

export default MarkerWithImage;