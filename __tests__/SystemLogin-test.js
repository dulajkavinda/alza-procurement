import * as firebase from "firebase";

// this test case will check whether the login functionality is working
// right or wrong

describe("Firebase", function() {
  it("auth succeed", () => {
    const config = {
      apiKey: "AIzaSyChXSKVGzjyasasasS5H_c3nNvRzqTMXZwXW3Bd4",
      authDomain: "procurment-d005a.firebaseapp.com",
      databaseURL: "https://procurment-d005a.firebaseio.com",
      projectId: "procurment-d005a",
      storageBucket: "",
      messagingSenderId: "812076684422",
      appId: "1:812076684422:web:28b03d5e2f24a1d0932d07",
      measurementId: "G-9LGMHTQW28"
    };
    firebase
      .initializeApp(config)
      .database()
      .ref();
    firebase.auth().signInWithEmailAndPassword("dulaj@gmail.com", "123456");
  });
});
