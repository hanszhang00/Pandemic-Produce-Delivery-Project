/**
 * @Libraries
 */
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
// Use Firebase_Production_key if You want to test or use for production
//import { firebaseConfig as Firebase_Production_key } from "../config/firebase_key";
import { firebaseConfig as Firebase_Development_key } from "../config/firebase_key.example";
/**
 * Initialize firebase
 */

firebase.initializeApp(Firebase_Development_key);

/**
 *
 * @param user the User object from firebase
 * @param additionalData any additionalData passed in
 * @param additionalData[0] boolean value of whether the user is previleged or not
 * @returns firebase document reference to the user document
 */
export const createUserProfileDocument = async (user, additionalData) => {
  // If user is null
  if (user === null) throw new Error("user passed in shouldn't be null");

  // TODO: might want to add the Google account's profile pic!
  // const profilePic = user.photoURL;

  // Reference to the document
  const userRef = firestore.doc(`users/${user.uid}`);

  // Check whether user document exists
  const snapShot = await userRef.get();

  // If data doesn't exist
  if (!snapShot.exists) {
    const { displayName, email } = user;
    const createdAt = new Date();
    try {
      // Populate data
      await userRef.set({
        displayName,
        email,
        createdAt,
        privilege: additionalData[0],
      });
    } catch (error) {
      //TODO: want to show a pop-window rather than simply doing alert
      alert("error creating user", error.message);
      throw error;
    }
  }
  // Return doucment reference
  return userRef;
};

export const checkUserIsAuthenticated = async (user) => {
  // If user is null
  if (user === null) throw new Error("user passed in shouldn't be null");

  // Reference to the document
  const userRef = firestore.doc(`users/${user.uid}`);

  // Check whether user document exists
  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    throw new Error("user should already be created and stored in the store");
  } else {
    return snapShot.get("privilege");
  }
};

export const addCollectionAndDocuments = async (
  collectionKeys,
  objectsToAdd
) => {
  const collectionRef = firestore.collection(collectionKeys);
  const batch = firestore.batch();
  objectsToAdd.forEach((object) => {
    batch.set(collectionRef.doc(), object);
  });
  return await batch.commit();
};

export const convertProductsToMap = (snapshot) => {
  const products = snapshot.docs.map((doc) => {
    const { title, items } = doc.data();
    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items,
    };
  });
  return products.reduce((accumulator, product) => {
    accumulator[product.title.toLowerCase()] = product;
    return accumulator;
  }, {});
};

// Exporting auth and firestore documents
export const auth = firebase.auth();
export const firestore = firebase.firestore();

// Exporting google auth
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
