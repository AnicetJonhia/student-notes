import Navbar from "./components/Navbar.tsx";

import MainLayout from "./components/MainLayout.tsx";

const App = () => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">

        <MainLayout />
      </div>
    </div>
  );
};

export default App;
