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
  const [fetchedAddress, setFetchedAddress] = useState(address || `${position.lat}, ${position.lng}`);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    if (id) return;

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
      id: id.toString(),
      position: [position.lat, position.lng],
      address: fetchedAddress,
      type
    }).catch((e) => alert(e))
    setId(null);
  }

  return (
    <Marker position={position}>
      <Popup>
        <span>{fetchedAddress}</span>
        {
          image &&
          <img width="200" alt="uploaded" src={image} />
        }
        <input type="file" name="myImage" onChange={onImageChange} />
        {
          isTemporary && id && <button onClick={onMarkerPlaced}>Place</button>
        }
      </Popup>
    </Marker>
  )
}

export default MarkerWithImage;