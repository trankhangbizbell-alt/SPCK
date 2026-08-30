// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuzf07XzJeDPNQ3J3ujd6aDISsl8Ewp9o",
  authDomain: "news-fbabd.firebaseapp.com",
  projectId: "news-fbabd",
  storageBucket: "news-fbabd.firebasestorage.app",
  messagingSenderId: "629916229666",
  appId: "1:629916229666:web:168bb21e4e5ec752c32a7b",
  measurementId: "G-NW8N33K49Z"
};
var db;
if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
}

console.log("Firebase initialized:", firebase.app().name);


db.collection("products").get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
            const product = doc.data();
            console.log(product);
            });
          });