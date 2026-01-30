// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth } from "../Firebase/config";

const AuthContext = createContext();

// Custom hook to use the auth context easily
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Sign Up Function
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // 2. Login Function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // 3. Logout Function
  function logout() {
    return signOut(auth);
  }

  // 4. Monitor Auth State (The "Persistence" Logic)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Done loading once we know if user exists or not
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  const value = {
    user,
    signup,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}