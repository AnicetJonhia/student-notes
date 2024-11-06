import { useState } from "react";
import MainLayout from "./components/MainLayout";
import Navbar from "./components/Navbar";

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  return (
    <div className="h-screen flex flex-col">
      <Navbar onSelectCategory={setSelectedCategory} />

        <MainLayout selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

    </div>
  );
};

export default App;