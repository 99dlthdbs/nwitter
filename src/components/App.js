import React, { useState } from 'react';
import AppRouter from 'components/AppRouter';
import { authService } from 'fbase';

function App() {
  console.log(authService.currentUser);

  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  return (
    <div>
      <AppRouter isLoggedIn={isLoggedIn} />
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </div>
  );
}

export default App;