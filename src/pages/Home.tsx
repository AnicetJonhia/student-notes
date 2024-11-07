import { useState } from "react";
import MainLayout from "../components/MainLayout";
import Navbar from "../components/Navbar";
import { Category } from "../types/Category";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);



  return (
    <div className="h-screen flex flex-col justify-between">
      <div className="flex-grow flex flex-col">
        <Navbar onSelectCategory={setSelectedCategory} />
        <MainLayout selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>

      <footer className="text-center p-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Anicet et Nasandratra. PDN. Tous droits réservés.
      </footer>
    </div>
  );
};

export default Home;
