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

  useEffect(() => {
    const title = "Linkr | Fast URL Shortener";
    const description =
      "Linkr is a fast URL shortener with custom short codes, secure login, and recent link management for creators and teams.";
    const canonicalUrl = `${window.location.origin}${window.location.pathname}`;

    document.title = title;

    const ensureMetaTag = (selector, attributes) => {
      let tag = document.head.querySelector(selector);
      if (!tag) {
        tag = document.createElement("meta");
        document.head.appendChild(tag);
      }

      Object.entries(attributes).forEach(([key, value]) => {
        tag.setAttribute(key, value);
      });
    };

    const ensureLinkTag = (selector, attributes) => {
      let tag = document.head.querySelector(selector);
      if (!tag) {
        tag = document.createElement("link");
        document.head.appendChild(tag);
      }

      Object.entries(attributes).forEach(([key, value]) => {
        tag.setAttribute(key, value);
      });
    };

    ensureMetaTag('meta[name="description"]', {
      name: "description",
      content: description,
    });
    ensureMetaTag('meta[name="robots"]', {
      name: "robots",
      content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    });
    ensureMetaTag('meta[name="theme-color"]', {
      name: "theme-color",
      content: "#0d1117",
    });
    ensureMetaTag('meta[property="og:type"]', {
      property: "og:type",
      content: "website",
    });
    ensureMetaTag('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: "Linkr",
    });
    ensureMetaTag('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });
    ensureMetaTag('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    ensureMetaTag('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl,
    });
    ensureMetaTag('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    ensureMetaTag('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title,
    });
    ensureMetaTag('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    ensureLinkTag('link[rel="canonical"]', {
      rel: "canonical",
      href: canonicalUrl,
    });

    const jsonLdId = "linkr-structured-data";
    let script = document.getElementById(jsonLdId);
    if (!script) {
      script = document.createElement("script");
      script.id = jsonLdId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Linkr",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description,
      url: canonicalUrl,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    });
  }, []);

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
