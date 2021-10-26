import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { useState } from 'react';
import './App.css';
import initializeAuthentication from './Firebase/firebase.initialize';

const googleProvider = new GoogleAuthProvider();
const gitHubProvider = new GithubAuthProvider();
// googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
initializeAuthentication();

function App() {
  const [loggedInUser, setLoggedInUser] = useState({});
  const auth = getAuth();
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const { displayName, photoURL, email } = result.user;
        setLoggedInUser({
          name: displayName,
          img: photoURL,
          email,
        });
      })
      .then((err) => {
        console.log(err);
      });
  };

  const handleGitHubSignIn = () => {
    signInWithPopup(auth, gitHubProvider)
      .then((result) => {
        const { displayName, photoURL, email } = result.user;
        setLoggedInUser({
          name: displayName,
          img: photoURL,
          email,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // sign out function

  const handelSignOut = () => {
    signOut(auth);
    setLoggedInUser({});
  };

  return (
    <div>
      {!loggedInUser.name ? (
        <span>
          <button onClick={handleGoogleSignIn}>Google Sign In</button>
          <button onClick={handleGitHubSignIn}>GitHub Sign In</button>
        </span>
      ) : (
        <button onClick={handelSignOut}>Sign Out</button>
      )}
      {loggedInUser.name && (
        <div>
          <h1>Welcome {loggedInUser.name} </h1>
          <p>Your Email: {loggedInUser.email}</p>
          <img src={loggedInUser.img} alt='' />
        </div>
      )}
    </div>
  );
}

export default App;
