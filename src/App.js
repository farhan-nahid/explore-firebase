import {
  createUserWithEmailAndPassword,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import './App.css';
import initializeAuthentication from './Firebase/firebase.initialize';

const googleProvider = new GoogleAuthProvider();
const gitHubProvider = new GithubAuthProvider();
// googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
initializeAuthentication();

function App() {
  const [loggedInUser, setLoggedInUser] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const auth = getAuth();

  // google auth

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const { displayName, photoURL, email } = result.user;
        setLoggedInUser({
          name: displayName,
          img: photoURL,
          email,
        });
        setError('');
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  // gitHub auth

  const handleGitHubSignIn = () => {
    signInWithPopup(auth, gitHubProvider)
      .then((result) => {
        const { displayName, photoURL, email } = result.user;
        setLoggedInUser({
          name: displayName,
          img: photoURL,
          email,
        });
        setError('');
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  // email pass auth

  const handelEmail = (e) => {
    setEmail(e.target.value);
  };

  const handelPassword = (e) => {
    setPassword(e.target.value);
  };

  const handelRegistrationChange = (e) => {
    setIsRegister(e.target.checked);
  };

  const handelRegister = (e) => {
    e.preventDefault();
    isRegister ? loginUser(email, password) : createNewUser(email, password);
  };

  // create new user

  const createNewUser = (email, password) => {
    if (password.length <= 8) {
      setError('Password should be at least 8 characters');
    } else if (!/(?=.*?[A-Z])/.test(password)) {
      setError('Password should be at least 1 Uppercase');
    } else if (!/(?=.*?[0-9])/.test(password)) {
      setError('Password should be at least 1 Number');
    } else if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      setError('Password should be at least 1 Spacial character');
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
          sendEmailVerification(auth.currentUser);
          setError('');
          setSuccess('we send an verification mail. check now!!!');
        })
        .catch((err) => {
          setError(err.message);
          setSuccess('');
        });
    }
  };

  // login

  const loginUser = (email, password) => {
    if (auth.currentUser.emailVerified) {
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
          setError('');
          setSuccess('Log In successfully');
        })
        .catch((err) => {
          setError(err.message);
          setSuccess('');
        });
    } else {
      console.log('asd');
      setSuccess('');
      setError('Place check your mail. we send a verification mail');
    }
  };

  const resetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSuccess('Send a mail on your gmail account');
      })
      .catch((err) => {
        setError(err.message);
        setSuccess('');
      });
  };

  // sign out function

  const handelSignOut = () => {
    signOut(auth);
    setLoggedInUser({});
  };

  return (
    <Container>
      <Form
        className='my-5 border p-5 rounded shadow'
        onSubmit={handelRegister}
      >
        <h1 className='mb-5 text-success fw-bold'>
          Please {isRegister ? 'Login ' : 'Registration'}
        </h1>
        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            onBlur={handelEmail}
            required
          />
          <Form.Text className='text-muted'>
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className='mb-3' controlId='formBasicPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Password'
            onBlur={handelPassword}
            required
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='formBasicCheckbox'>
          <Form.Check
            type='checkbox'
            label='Already Registered ?'
            onChange={handelRegistrationChange}
          />
        </Form.Group>
        {success ? (
          <h5 className='text-success mb-3'>{success}</h5>
        ) : (
          <h5 className='text-danger mb-3'>{error}</h5>
        )}

        <Button variant='primary' type='submit' className='me-5'>
          {isRegister ? 'Login ' : 'Registration'}
        </Button>
        <Button onClick={resetPassword} variant='warning'>
          Reset PassWord
        </Button>
      </Form>
      {!loggedInUser.name ? (
        <div className='text-center py-5 rounded shadow-lg'>
          <Button onClick={handleGoogleSignIn} className='me-5'>
            Google Sign In
          </Button>
          <Button onClick={handleGitHubSignIn}>GitHub Sign In</Button>
        </div>
      ) : (
        <button onClick={handelSignOut}>Sign Out</button>
      )}
      {loggedInUser.name && (
        <div className='text-center py-5 rounded shadow-lg'>
          <h1>Welcome {loggedInUser.name} </h1>
          <p>Your Email: {loggedInUser.email}</p>
          <img src={loggedInUser.img} alt='' />
        </div>
      )}
    </Container>
  );
}

export default App;
