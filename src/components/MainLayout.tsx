import { useState } from "react";

const MainLayout = () => {
  const [notes, setNotes] = useState([{ title: "Sample Note", content: "This is a note." }]);
  const [selectedNote, setSelectedNote] = useState<any>(null);

  return (
    <main className="flex-1 bg-gray-100 p-6">
      <div className="grid grid-cols-3 gap-6">
        <div>
          <h2 className="text-xl mb-4">Notes</h2>
          <ul>
            {notes.map((note, index) => (
              <li
                key={index}
                onClick={() => setSelectedNote(note)}
                className="cursor-pointer bg-white p-4 mb-2 rounded shadow"
              >
                {note.title}
              </li>
            ))}
          </ul>

        </div>
        {selectedNote && (
          <div className="col-span-2 bg-white p-6 rounded shadow">
            <h2 className="text-xl">Edit Note</h2>
            <input
              type="text"
              value={selectedNote.title}
              onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
              className="border p-2 w-full mb-4"
            />
            <textarea
              value={selectedNote.content}
              onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
              className="border p-2 w-full h-48"
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default MainLayout;
