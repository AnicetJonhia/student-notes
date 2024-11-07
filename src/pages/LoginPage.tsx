import { auth, provider } from "../firebase/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);

    console.log("result user", result.user);
     if (result.user) {
      navigate("/home");
    } else {
      console.error("No user information returned from sign-in.");
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
};

  return (
    <div className="flex h-screen flex-col justify-between">
      <div className="flex-grow flex items-center justify-center px-4">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Bienvenue sur PDN</CardTitle>
            <CardDescription>
              Votre plateforme de prise de notes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button onClick={handleLogin}>Se connecter avec Google</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="text-center p-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Anicet et Nasandratra. PDN. Tous droits réservés.
      </footer>
    </div>
  );
};

export default LoginPage;
