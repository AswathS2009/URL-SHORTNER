import { useEffect, useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";

function App() {
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || "",
  );
  const [activeModal, setActiveModal] = useState(null);
  const [authUser, setAuthUser] = useState(() => {
    const rawUser = localStorage.getItem("authUser");
    if (!rawUser) return null;
    try {
      return JSON.parse(rawUser);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [authToken]);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem("authUser", JSON.stringify(authUser));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [authUser]);

  const isAuthenticated = Boolean(authUser && authToken);

  const openLogin = () => setActiveModal("login");
  const openSignup = () => setActiveModal("signup");
  const closeModal = () => setActiveModal(null);

  const handleAuthSuccess = ({ user, token }) => {
    setAuthUser(user);
    setAuthToken(token);
    closeModal();
  };

  const handleLogout = () => {
    setAuthUser(null);
    setAuthToken("");
    closeModal();
  };

  return (
    <HomePage
      activeModal={activeModal}
      isAuthenticated={isAuthenticated}
      authUser={authUser}
      authToken={authToken}
      onLoginClick={openLogin}
      onSignupClick={openSignup}
      onCloseModal={closeModal}
      onAuthSuccess={handleAuthSuccess}
      onLogout={handleLogout}
    />
  );
}

export default App;
