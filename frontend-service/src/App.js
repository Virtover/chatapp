import React, { useState, useEffect } from 'react';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Chat from './components/Chat';
import { LS_LOGIN_DATA } from './names';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);

  useEffect(() => {
    const loginData = localStorage.getItem(LS_LOGIN_DATA);
    if (loginData) {
      setLoggedIn(true);
    }
  }, []);

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div>
      {loggedIn ? (
        <Chat />
      ) : isSignIn ? (
        <SignIn toggleForm={toggleForm} setLoggedIn={setLoggedIn} />
      ) : (
        <SignUp toggleForm={toggleForm} setLoggedIn={setLoggedIn} />
      )}
    </div>
  );
};

export default App;
