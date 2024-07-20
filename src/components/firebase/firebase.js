// import { initializeApp } from "firebase/app";
// import { getMessaging, onMessage, getToken } from "firebase/messaging";

// const firebaseConfig = {
//     apiKey: "AIzaSyDOdRrnfH16hU3bo6NoQYWUMAyUZVZsl0Y",
//     authDomain: "rcts-cf4e0.firebaseapp.com",
//     projectId: "rcts-cf4e0",
//     storageBucket: "rcts-cf4e0.appspot.com",
//     messagingSenderId: "550029953436",
//     appId: "1:550029953436:web:754c48df8269246e262059",
//     measurementId: "G-EFJS7QXSDZ"
//   };

// initializeApp(firebaseConfig);
// const messaging = getMessaging();


// export const requestForToken = () => {
//     return getToken(messaging, {vapidkey: "BKxx4v-GL39bx67GjE4NFKPDfIdOgQgqi_VpYDNnSKrc7TDgMHBx9A_0cDFpSp0YccerX0QEnqSdgyQ9o_X4vCA"})
//     .then((currentToken) => {
//          if(currentToken){
//              console.log("Token client:",currentToken);
//          } else {
//             console.log('No registration token available');
//          }

//     })
//     .catch(err => {
//         console.log('Error while register token', err);
//     })
// }

// export const onMessageListener = () => {
//     return new Promise((resolve) => {
//         onMessage(messaging, (payload) => {
//             console.log("OnMessage Payload", payload);

//             resolve(payload);
            
//         })
//     })
// }


