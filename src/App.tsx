import { useState } from "react";
import Navbar from "./components/Navbar.tsx";
import MainLayout from "./components/MainLayout.tsx";

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="h-screen flex flex-col">
      <Navbar onSelectCategory={setSelectedCategory} />
      <div className="flex flex-1">
        <MainLayout selectedCategory={selectedCategory} />
      </div>
    </div>
  );
};

export default App;