import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet.tsx";
import { EllipsisVertical, Menu, Pencil, Trash } from "lucide-react";
import { Button } from "./ui/button.tsx";
import Auth from "./Auth.tsx";
import { db } from "../firebase/firebaseConfig.ts";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth"; // Custom hook to get the current user
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu.tsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog.tsx";
import { Input } from "./ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { ToggleDarkMode } from "./utils/ToggleDarkMode.tsx";

interface Category {
  id: string;
  name: string;
  color: string;
  user_id: string;
}

interface NavbarProps {
  onSelectCategory: (category: Category | null) => void;
}

export default function Navbar({ onSelectCategory }: NavbarProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", color: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const { user } = useAuth(); // Get the current user

  useEffect(() => {
    const fetchCategories = async () => {
      if (user) {
        const q = query(collection(db, "categories"), where("user_id", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const categoriesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        setCategories(categoriesData);
      } else {
        setCategories([]);
      }
    };

    fetchCategories();
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
      setIsNewCategoryDialogOpen(false);
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

  const openDialog = (category: Category) => {
    setCurrentCategory(category);
    setIsDialogOpen(true);
  };

  const handleUpdateCategory = () => {
    if (currentCategory) {
      updateCategory(currentCategory.id, { name: currentCategory.name, color: currentCategory.color });
      setIsDialogOpen(false);
    }
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
        <SheetContent side="left" className="flex flex-col h-full">
          <nav className="flex flex-col gap-2 text-lg font-medium flex-grow h-full">
            <span>Catégories</span>
            <div className="overflow-y-scroll flex-grow">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between text-muted-foreground text-sm font-semibold px-4 py-2">
                  <span onClick={() => { closeSheet(); onSelectCategory(category); }} className="cursor-pointer flex items-center">
                    <span className="inline-block w-5 h-5 rounded-full mr-2" style={{ backgroundColor: category.color }}></span>
                    {category.name}
                  </span>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <EllipsisVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                          <Button
                            className="cursor-pointer w-full mt-2 p-3"
                            variant="outline"
                            onClick={() => openDialog(category)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button className="cursor-pointer w-full mt-2 p-3" variant="destructive" onClick={() => deleteCategory(category.id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4" onClick={() => setIsNewCategoryDialogOpen(true)}>
              Nouvelle catégorie
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="ml-auto flex-1">
        <span>PDN</span>
      </div>
      <ToggleDarkMode />
      <Auth />

      {currentCategory && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Category</DialogTitle>
              <DialogDescription>
                Update the name and color of the category.
              </DialogDescription>
            </DialogHeader>
            <Input
              type="text"
              value={currentCategory.name}
              onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
              className="border p-2"
            />
            <Select
              value={currentCategory.color}
              onValueChange={(value) => setCurrentCategory({ ...currentCategory, color: value })}
              className="border p-2"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="red">
                  <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: 'red' }}></span>
                  Red
                </SelectItem>
                <SelectItem value="green">
                  <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: 'green' }}></span>
                  Green
                </SelectItem>
                <SelectItem value="blue">
                  <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: 'blue' }}></span>
                  Blue
                </SelectItem>
                <SelectItem value="pink">
                  <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: 'pink' }}></span>
                  Pink
                </SelectItem>
                <SelectItem value="orange">
                  <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: 'orange' }}></span>
                  Orange
                </SelectItem>
                <SelectItem value="cyan">
                  <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: 'cyan' }}></span>
                  Cyan
                </SelectItem>
                <SelectItem value="purple">
                  <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: 'purple' }}></span>
                  Purple
                </SelectItem>
                <SelectItem value="gold">
                  <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: 'gold' }}></span>
                  Gold
                </SelectItem>
                <SelectItem value="crimson">
                  <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: 'crimson' }}></span>
                  Crimson
                </SelectItem>
                <SelectItem value="yellow">
                  <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: 'yellow' }}></span>
                  Yellow
                </SelectItem>
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleUpdateCategory}>Valider</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle catégorie</DialogTitle>
            <DialogDescription>
              Entrez le nom et sélectionnez la couleur de la nouvelle catégorie.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Category name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            className="border p-2"
          />
          <Select
            value={newCategory.color}
            onValueChange={(value) => setNewCategory({ ...newCategory, color: value })}
            className="border p-2"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="red">
                <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: 'red' }}></span>
                Red
              </SelectItem>
              <SelectItem value="green">
                <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: 'green' }}></span>
                Green
              </SelectItem>
              <SelectItem value="blue">
                <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: 'blue' }}></span>
                Blue
              </SelectItem>
              <SelectItem value="pink">
                <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: 'pink' }}></span>
                Pink
              </SelectItem>
              <SelectItem value="orange">
                <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: 'orange' }}></span>
                Orange
              </SelectItem>
              <SelectItem value="cyan">
                <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: 'cyan' }}></span>
                Cyan
              </SelectItem>
              <SelectItem value="purple">
                <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: 'purple' }}></span>
                Purple
              </SelectItem>
              <SelectItem value="gold">
                <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: 'gold' }}></span>
                Gold
              </SelectItem>
              <SelectItem value="crimson">
                <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: 'crimson' }}></span>
                Crimson
              </SelectItem>
              <SelectItem value="yellow">
                <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: 'yellow' }}></span>
                Yellow
              </SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewCategoryDialogOpen(false)}>Annuler</Button>
            <Button onClick={addCategory}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}