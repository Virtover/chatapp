import React, { useState, useEffect } from 'react';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Chat from './components/Chat';
import { LS_LOGIN_DATA } from './names';
import { USERS_SERVICE_URL } from './config';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);

  useEffect(() => {
    const loginData = localStorage.getItem(LS_LOGIN_DATA);
    if (loginData) {
      setLoggedIn(true);
      const dataParsed = JSON.parse(loginData);
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: dataParsed.username,
          token: dataParsed.token,
        }),
      };
      
      fetch(`${USERS_SERVICE_URL}/verify_token`, options)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          return response.json().then((e) => {
            throw new Error(e.detail || "Unknown error");
          });
        })
        .then((json) => {
          setLoggedIn(json.result);
        })
        .catch((e) => {
          setLoggedIn(false);
        });
    }
  }, []);

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div data-bs-theme="dark">
      {loggedIn ? (
        <Chat setLoggedIn={setLoggedIn}/>
      ) : isSignIn ? (
        <SignIn toggleForm={toggleForm} setLoggedIn={setLoggedIn} />
      ) : (
        <SignUp toggleForm={toggleForm} setLoggedIn={setLoggedIn} />
      )}
    </div>
  );
};

export default App;
