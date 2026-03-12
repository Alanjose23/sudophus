import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GetFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4pOLEw_BZ6Hwn34J_cEg1azYFh3utX5U",
  authDomain: "sudophus.firebaseapp.com",
  projectId: "sudophus",
  storageBucket: "sudophus.firebasestorage.app",
  messagingSenderId: "712712819868",
  appId: "1:712712819868:web:95ee7feefc19ace6fec959",
  measurementId: "G-RSH9LMQDPR"
};

const app = initializeApp(firebaseConfig);
var analytics = getAnalytics(app);

export const db = GetFirestore(app);

