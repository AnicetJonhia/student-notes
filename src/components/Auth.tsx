
import { auth, provider } from "../firebase/firebaseConfig.ts";
import { signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button.tsx";
import { Separator } from "./ui/separator";
import { LogOut } from "lucide-react";

const Auth = () => {
  const [user, setUser] = useState(auth.currentUser);
  const navigate = useNavigate();

  const handleLogin = async () => {
    await signInWithPopup(auth, provider);
    setUser(auth.currentUser);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setUser(user));
    return unsubscribe;
  }, []);

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className={"cursor-pointer"}>
          <AvatarImage src={user.photoURL || ""} alt="" />
          <AvatarFallback>
            {user.displayName?.split(" ").map((name) => name[0]).join("")}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <span>{user.displayName}</span>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem className={"cursor-pointer"} onClick={handleLogout}>
          <LogOut />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button onClick={handleLogin}>S'authentifier avec Google</Button>
  );
};

export default Auth;
