
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import {ThemeProvider} from "./context/ThemeContext.tsx";

const App = () => {
  return (
       <ThemeProvider>
                <Router>
                  <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/home" element={<Home />} />
                  </Routes>
                </Router>
       </ThemeProvider>
  );
};

export default App;
