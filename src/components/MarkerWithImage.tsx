import { ChangeEventHandler, FC, useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet"
import { MarkerType, addNewMarker } from "../services/Firebase";

interface Props {
  position: number[],
  type?: MarkerType,
  isTemporary: boolean
}

const MarkerWithImage: FC<Props> = ({ position, type = MarkerType.DONE, isTemporary = false }) => {
  const [image, setImage] = useState("");
  const [address, setAddress] = useState("");
  const [id, setId] = useState("");
  const [isPlaced, setIsPlaced] = useState(isTemporary ? false : true);

  useEffect(() => {
    const reverseGeocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}&zoom=18&addressdetails=1`;
    fetch(reverseGeocodingUrl)
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        setAddress(responseJson.display_name)
        setId(responseJson.place_id)
      })
      .catch(error => console.log('Reverse Geocode', error));
  }, [position])

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
    address,
    type
  })
  setIsPlaced(true);
}

  return (
    <Marker position={{lat: position[0], lng: position[1]}}>
      <Popup>
        <span>{address}</span>
        {
          image &&
          <img width="200" alt="uploaded" src={image} />
        }
        <input type="file" name="myImage" onChange={onImageChange} />
        {
          isTemporary && !isPlaced && <button onClick={onMarkerPlaced}>Place</button>
        }
      </Popup>
    </Marker>
  )
}

export default MarkerWithImage;