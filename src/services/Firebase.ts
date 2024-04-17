// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { LatLng } from "leaflet";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const COLLECTION_MARKERS = "markers";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "building-selector.firebaseapp.com",
  projectId: "building-selector",
  storageBucket: "building-selector.appspot.com",
  messagingSenderId: "379813250486",
  appId: "1:379813250486:web:f5959129171b86ec226d17",
  measurementId: "G-B4JP9XZ5KF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export enum MarkerType {
  DONE = "done",
  PENDING = "pending",
  PROBLEM = "problem"
}

export interface IMarker {
  id: string,
  address: string,
  position: LatLng,
  imgs?: string[],
  type: MarkerType
}

export const getMarkers = async () => {
  const q = query(collection(db, COLLECTION_MARKERS), where("type", "==", MarkerType.DONE));
  return getDocs(q).then((querySnapshot) => {
    const markers = [] as IMarker[];
    
    querySnapshot.forEach((doc) => {
      const { id, address, type, position } = doc.data();
      
      markers.push({
        id,
        address,
        type,
        position
      })
    });

    return markers
  })
}

export const addNewMarker = async (marker: IMarker) => {
  console.log(marker);
  // Add a new document in collection "cities"
  await setDoc(doc(db, COLLECTION_MARKERS, marker.id), marker);
}