// src/firebase/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
   apiKey: "AIzaSyD_czS3wtrx5VQG80UoQ_ccfNv7HvW_VGY",
  authDomain: "my-portfolio-841e6.firebaseapp.com",
  projectId: "my-portfolio-841e6",
  storageBucket: "my-portfolio-841e6.firebasestorage.app",
  messagingSenderId: "925926184941",
  appId: "1:925926184941:web:d2d0e42f789591133439e4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
