// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAa2rJ1IfNRNS0U3BjrGR35yhJqWJNuGY0",
  authDomain: "coffee-management-68648.firebaseapp.com",
  projectId: "coffee-management-68648",
  storageBucket: "coffee-management-68648.firebasestorage.app",
  messagingSenderId: "989797262072",
  appId: "1:989797262072:web:5502af3d91976b3575510d",
  measurementId: "G-8MN5TN28N9"
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