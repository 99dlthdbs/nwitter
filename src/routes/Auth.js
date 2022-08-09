import React, { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from 'firebase/auth';
import { authService } from 'fbase';

function Auth() {
  const auth = getAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        data = await signInWithEmailAndPassword(auth, email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === 'google') {
      provider = new GoogleAuthProvider();
    } else if (name === 'github') {
      provider = new GithubAuthProvider();
    }
    const data = await signInWithPopup(authService, provider);
    console.log(data);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          name='email'
          type='email'
          placeholder='Email'
          required
          value={email}
        />
        <input
          onChange={onChange}
          name='password'
          type='text'
          placeholder='Password'
          required
          value={password}
        />
        <input type='submit' value={newAccount ? 'Create Account' : 'Log In'} />
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? 'Log In' : 'Create Account'}
      </span>
      <button onClick={onSocialClick} name='google'>
        Continue with Google
      </button>
      <button onClick={onSocialClick} name='github'>
        Continue with Github
      </button>
    </div>
  );
}

export default Auth;
