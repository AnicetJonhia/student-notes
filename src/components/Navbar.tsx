import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet.tsx";
import { Menu } from "lucide-react";
import { Button } from "./ui/button.tsx";
import Auth from "./Auth.tsx";
import { db } from "../firebase/firebaseConfig.ts";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth"; // Custom hook to get the current user

interface Category {
  id: string;
  name: string;
  color: string;
  user_id: string;
}

export default function Navbar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", color: "" });
  const { user } = useAuth(); // Get the current user

  useEffect(() => {
    if (user) {
      const fetchCategories = async () => {
        const q = query(collection(db, "categories"), where("user_id", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const categoriesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        setCategories(categoriesData);
      };

      fetchCategories();
    }
  }, [user]);

  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  const addCategory = async () => {
    if (user) {
      const newCategoryWithUser = { ...newCategory, user_id: user.uid };
      const docRef = await addDoc(collection(db, "categories"), newCategoryWithUser);
      setCategories([...categories, { id: docRef.id, ...newCategoryWithUser }]);
      setNewCategory({ name: "", color: "" });
    }
  };

  const updateCategory = async (id: string, updatedCategory: Partial<Category>) => {
    const categoryDoc = doc(db, "categories", id);
    await updateDoc(categoryDoc, updatedCategory);
    setCategories(categories.map(category => category.id === id ? { ...category, ...updatedCategory } : category));
  };

  const deleteCategory = async (id: string) => {
    const categoryDoc = doc(db, "categories", id);
    await deleteDoc(categoryDoc);
    setCategories(categories.filter(category => category.id !== id));
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0" onClick={() => setIsSheetOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <span>Catégories</span>
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between text-muted-foreground text-sm font-semibold px-4 py-2">
                <span onClick={closeSheet}  style={{ color: category.color }}>{category.name}</span>
                <div>
                  <button onClick={() => updateCategory(category.id, { name: prompt("New name:", category.name) || category.name })}>Edit</button>
                  <button onClick={() => deleteCategory(category.id)}>Delete</button>
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Category name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Category color"
                value={newCategory.color}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                className="border p-2"
              />
              <button onClick={addCategory} className="bg-blue-500 text-white p-2 rounded">Add Category</button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="ml-auto flex-1">
        <span>PDN</span>
      </div>
      <Auth />
    </header>
  );
}