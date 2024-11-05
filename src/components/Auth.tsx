import { auth, provider } from "../firebase/firebaseConfig.ts";
import { signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

const Auth = () => {
  const [user, setUser] = useState(auth.currentUser);

  const handleLogin = async () => {
    await signInWithPopup(auth, provider);
    setUser(auth.currentUser);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setUser(user));
    return unsubscribe;
  }, []);

  return user ? (
    <div className={"flex justify-between space-x-4"}>
      <p>{user.displayName}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  ) : (
    <button onClick={handleLogin}>Login with Google</button>
  );
};

export default Auth;
