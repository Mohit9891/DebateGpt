import { createContext, useContext, useEffect, useState } from "react";
import { authApi, getSessionId } from "../api/client.js";

export const AuthContext = createContext({ user: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("debate_jwt")) {
      setLoading(false);
      return;
    }
    authApi.me()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem("debate_jwt"))
      .finally(() => setLoading(false));
  }, []);

  const loginWithGoogle = async (idToken) => {
    const data = await authApi.google({ idToken, sessionId: getSessionId() });
    localStorage.setItem("debate_jwt", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("debate_jwt");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, isLoggedIn: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
