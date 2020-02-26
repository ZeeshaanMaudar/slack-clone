import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';


// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCHErz0n19rTRjI87v6Ngcrbr_ozsLEpLg",
    authDomain: "react-slack-clone-3adb5.firebaseapp.com",
    databaseURL: "https://react-slack-clone-3adb5.firebaseio.com",
    projectId: "react-slack-clone-3adb5",
    storageBucket: "react-slack-clone-3adb5.appspot.com",
    messagingSenderId: "933772735729",
    appId: "1:933772735729:web:2db70ea5c047ebb2f92550",
    measurementId: "G-GEFQG3GW80"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;
  