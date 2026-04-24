import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'

function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  const isAuthenticated = Boolean(authUser);

  const openLogin = () => setActiveModal("login");
  const openSignup = () => setActiveModal("signup");
  const closeModal = () => setActiveModal(null);

  const handleAuthSuccess = (user) => {
    setAuthUser(user);
    closeModal();
  };

  const handleLogout = () => {
    setAuthUser(null);
    closeModal();
  }

  return (
    <>
      <HomePage
        activeModal={activeModal}
        isAuthenticated={isAuthenticated}
        authUser={authUser}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
        onCloseModal={handleAuthSuccess}
        onLogout={handleLogout}
      />
    </>
  )
}

export default App
