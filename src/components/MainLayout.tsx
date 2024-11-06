import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig.ts";
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot } from "firebase/firestore";
import { Button } from "./ui/button.tsx";
import { Input } from "./ui/input.tsx";
import { Textarea } from "./ui/textarea.tsx";
import { useAuth } from "../hooks/useAuth"; // Custom hook to get the current user

interface Note {
  id: string;
  title: string;
  content: string;
  user_id: string;
  category: {
    name: string;
    color: string;
  };
}

interface Category {
  id: string;
  name: string;
  color: string;
  user_id: string;
}

interface MainLayoutProps {
  selectedCategory: Category | null;
}

const MainLayout = ({ selectedCategory }: MainLayoutProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({ title: "", content: "", category: { name: "", color: "" } });
  const { user } = useAuth();


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

  const handleAddNote = async () => {
    if (user) {
      const newNoteWithUser = { ...newNote, user_id: user.uid };
      const notesCollection = collection(db, "notes");
      await addDoc(notesCollection, newNoteWithUser);
      setNewNote({ title: "", content: "", category: { name: "", color: "" } });
    }
  };

  const handleUpdateNote = async (note: Note) => {
    const noteDoc = doc(db, "notes", note.id);
    await updateDoc(noteDoc, note);
    setSelectedNote(null);
  };

  const handleDeleteNote = async (noteId: string) => {
    const noteDoc = doc(db, "notes", noteId);
    await deleteDoc(noteDoc);
    setSelectedNote(null);
  };

  return (
    <main className="flex-1 bg-gray-100 p-6">
      <div className="grid grid-cols-3 gap-6">
        <div>
          <h2 className="text-xl mb-4">Notes</h2>
          <ul>
            {notes.map((note) => (
              <li
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className="cursor-pointer bg-white p-4 mb-2 rounded shadow"
              >
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: note.category.color }}></span>
                  {note.title}
                </div>
                <div className="text-sm text-gray-500">{note.category.name}</div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Input
              type="text"
              placeholder="New Note Title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <Textarea
              placeholder="New Note Content"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <select
              value={newNote.category.name}
              onChange={(e) => {
                const selectedCategory = categories.find(category => category.name === e.target.value);
                if (selectedCategory) {
                  setNewNote({ ...newNote, category: { name: selectedCategory.name, color: selectedCategory.color } });
                }
              }}
              className="border p-2 w-full mb-2"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
            <Button onClick={handleAddNote}>Ajouter une note</Button>
          </div>
        </div>
        {selectedNote && (
          <div className="col-span-2 bg-white p-6 rounded shadow">
            <h2 className="text-xl">Edition</h2>
            <Input
              type="text"
              value={selectedNote.title}
              onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
              className="border p-2 w-full mb-4"
            />
            <Textarea
              value={selectedNote.content}
              onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
              className="border p-2 w-full h-48"
            />
            <select
              value={selectedNote.category.name}
              onChange={(e) => {
                const selectedCategory = categories.find(category => category.name === e.target.value);
                if (selectedCategory) {
                  setSelectedNote({ ...selectedNote, category: { name: selectedCategory.name, color: selectedCategory.color } });
                }
              }}
              className="border p-2 w-full mb-4"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
            <div className="flex space-x-2 mt-4">
              <Button onClick={() => handleUpdateNote(selectedNote)}>Mettre à jour</Button>
              <Button variant="destructive" onClick={() => handleDeleteNote(selectedNote.id)}>Supprimer</Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default MainLayout;