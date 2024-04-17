import { ChangeEventHandler, FC, useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet"
import { MarkerType, addNewMarker } from "../services/Firebase";
import { LatLng } from "leaflet";

interface Props {
  address?: string,
  position: LatLng,
  type?: MarkerType,
  isTemporary: boolean
}

const MarkerWithImage: FC<Props> = ({ position, address, type = MarkerType.DONE, isTemporary = false }) => {
  const [image, setImage] = useState("");
  const [fetchedAddress, setFetchedAddress] = useState(address);
  const [id, setId] = useState("");

  useEffect(() => {
    if (fetchedAddress) return;

    const reverseGeocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&zoom=18&addressdetails=1`;
    fetch(reverseGeocodingUrl)
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        setFetchedAddress(responseJson.display_name)
        setId(responseJson.place_id)
      })
      .catch(error => console.log('Reverse Geocode', error));
  }, [position, fetchedAddress])

  const onImageChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target;
    if (target.files && target.files[0]) {
      let img = target.files[0];
      setImage(URL.createObjectURL(img));
    }
  }

  const onMarkerPlaced = async () => {
    await addNewMarker({
    id: id.toString(),
    position,
    address: fetchedAddress || `${position.lat}, ${position.lng}`,
    type
  })
}

  return (
    <Marker position={position}>
      <Popup>
        <span>{address}</span>
        {
          image &&
          <img width="200" alt="uploaded" src={image} />
        }
        <input type="file" name="myImage" onChange={onImageChange} />
        {
          isTemporary && <button onClick={onMarkerPlaced}>Place</button>
        }
      </Popup>
    </Marker>
  )
}

export default MarkerWithImage;