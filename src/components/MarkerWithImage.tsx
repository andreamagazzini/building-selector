import { LatLng } from "leaflet";
import { ChangeEventHandler, FC, useState } from "react";
import { Marker, Popup } from "react-leaflet"

interface Props {
  position: LatLng
}

const MarkerWithImage: FC<Props> = ({ position }) => {
  const [image, setImage] = useState("");

  const onImageChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target;
    if (target.files && target.files[0]) {
      let img = target.files[0];
      setImage(URL.createObjectURL(img));
    }
  }

  return (
    <Marker position={position}>
      <Popup>
        {
          image &&
          <img width="200" alt="uploaded" src={image} />
        }
        <input type="file" name="myImage" onChange={onImageChange} />
      </Popup>
    </Marker>
  )
}

export default MarkerWithImage;