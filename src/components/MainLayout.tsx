import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot } from "firebase/firestore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useAuth } from "../hooks/useAuth";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

import { Note } from "../types/Note";
import { Category } from "../types/Category";

type MainLayoutProps = {
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
};

const MainLayout = ({ selectedCategory, setSelectedCategory }: MainLayoutProps) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({ title: "", content: "", category: { name: "", color: "" } });
  const [isNewNoteDialogOpen, setIsNewNoteDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const notesCollection = collection(db, "notes");
      const notesQuery = selectedCategory
        ? query(notesCollection, where("user_id", "==", user.uid), where("category.name", "==", selectedCategory.name))
        : query(notesCollection, where("user_id", "==", user.uid));
      const unsubscribeNotes = onSnapshot(notesQuery, (snapshot) => {
        const notesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note));
        setNotes(notesList);
      });

      const categoriesCollection = collection(db, "categories");
      const categoriesQuery = query(categoriesCollection, where("user_id", "==", user.uid));
      const unsubscribeCategories = onSnapshot(categoriesQuery, (snapshot) => {
        const categoriesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        setCategories(categoriesList);
      });

      return () => {
        unsubscribeNotes();
        unsubscribeCategories();
      };
    }
  }, [user, selectedCategory]);

 if(!user) {return null;}


  const handleAddNote = async () => {
    try {
      if (user) {
        const newNoteWithUser = { ...newNote, user_id: user.uid };
        const notesCollection = collection(db, "notes");
        await addDoc(notesCollection, newNoteWithUser);
        setNewNote({ title: "", content: "", category: { name: "", color: "" } });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la note:', error);
    }
  };

  const handleUpdateNote = async (note: Note) => {
    try {
      const noteDoc = doc(db, "notes", note.id);
      await updateDoc(noteDoc, note);
      setSelectedNote(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const noteDoc = doc(db, "notes", noteId);
      await deleteDoc(noteDoc);
      setSelectedNote(null);
    } catch (error) {
      console.error('Erreur lors de la suppression de la note:', error);
    }
  };

  return (
    <main className="w-full h-full overflow-y-scroll bg-muted p-6">
      <div className="w-full p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl">Notes</h2>
          <Button className="ml-auto" onClick={() => setIsNewNoteDialogOpen(true)}>Nouvelle note</Button>
        </div>

        <Carousel opts={{ align: "start" }} className="w-full relative">
          <CarouselContent>
            <CarouselItem className="ml-10 md:basis-1/3 lg:basis-1/4 basis-1/3">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className="w-full sm:w-auto"
              >
                All
              </Button>
            </CarouselItem>
            {categories.map((category) => (
              <CarouselItem key={category.id} className="md:basis-1/3 lg:basis-1/4 basis-1/3">
                <Button
                  variant={selectedCategory?.id === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="w-full sm:w-auto"
                >
                  {category.name}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2" />
          <CarouselNext />
        </Carousel>

        <div className="flex items-center justify-center flex-wrap">
          {notes.map((note) => (
            <Card key={note.id} onClick={() => setSelectedNote(note)} className="cursor-pointer mb-2 mr-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>{note.title}</div>
                  <div className="flex items-center">
                    <span
                      className="inline-block w-4 h-4 mr-2 rounded-full"
                      style={{ backgroundColor: note.category.color }}
                    ></span>
                    <div className="text-sm text-gray-500">{note.category.name}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">{note.content.substring(0, 10)}...</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edition</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            value={selectedNote?.title || ""}
            onChange={(e) => setSelectedNote(selectedNote ? { ...selectedNote, title: e.target.value } : null)}
            className="border p-2 w-full mb-4"
          />
          <Textarea
            value={selectedNote?.content || ""}
            onChange={(e) => setSelectedNote(selectedNote ? { ...selectedNote, content: e.target.value } : null)}
            className="border p-2 w-full h-96"
          />
          <Select
            value={selectedNote?.category.name || ""}
            onValueChange={(value) => {
              const selectedCategory = categories.find(category => category.name === value);
              if (selectedCategory && selectedNote) {
                setSelectedNote({ ...selectedNote, category: { name: selectedCategory.name, color: selectedCategory.color } });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: category.color }}></span>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={() => selectedNote && handleUpdateNote(selectedNote)}>Mettre à jour</Button>
            <Button variant="destructive" onClick={() => selectedNote && handleDeleteNote(selectedNote.id)}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNewNoteDialogOpen} onOpenChange={setIsNewNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle note</DialogTitle>
            <DialogDescription>Entrez les détails de la nouvelle note.</DialogDescription>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Nouveau titre de note"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="border p-2 w-full mb-2"
          />
          <Textarea
            placeholder="Nouveau contenu de note"
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            className="border p-2 w-full h-96 mb-2"
          />
          <Select
            value={newNote.category.name}
            onValueChange={(value) => {
              const selectedCategory = categories.find(category => category.name === value);
              if (selectedCategory) {
                setNewNote({ ...newNote, category: { name: selectedCategory.name, color: selectedCategory.color } });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: category.color }}></span>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewNoteDialogOpen(false)}>Annuler</Button>
            <Button onClick={() => {
              setIsNewNoteDialogOpen(false);
              handleAddNote();
            }}>Ajouter une note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default MainLayout;