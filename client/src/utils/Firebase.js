
import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "loginfurever-877ae.firebaseapp.com",
  projectId: "loginfurever-877ae",
  storageBucket: "loginfurever-877ae.firebasestorage.app",
  messagingSenderId: "1030387403710",
  appId: "1:1030387403710:web:bdbe95736375c0c6b587ef"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
