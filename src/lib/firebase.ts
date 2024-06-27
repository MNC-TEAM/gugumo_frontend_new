// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const setTokenHanlder = async ()=>{

  const permission = await Notification.requestPermission();
  if(permission !== "granted") return;

  const messaging = getMessaging(app);

  await getToken(messaging,{
    vapidKey : process.env.NEXT_PUBLIC_FIREBASE_VAPIDKEY
  })
  .then(currentToken=>{
    if(currentToken){
      console.log(currentToken);
    }else{
      console.log('오류');
    }
  })
  .catch(err=>{
    console.log(err);
  });

}