// React Context Provider for creating, storing, and deleting TODO items with IDs
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

type Note = {
  id: string;
  text: string;
  date: string;
  priority: number;
};

type NotesContext = {
  notes: Note[];
  addNote: (props: { text: string; priority: number }) => void;
  deleteNote: (id: string) => void;
};

const NotesContext = createContext<NotesContext | undefined>(undefined);

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const { getItem, setItem } = useAsyncStorage("NOTES");

  // Load notes from storage
  useEffect(() => {
    let isMounted = true;
    getItem().then((json) => {
      if (!isMounted) return;

      if (json) {
        const loadedNotes = JSON.parse(json);
        setNotes(loadedNotes ?? []);
      } else {
        setNotes([]);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Persist notes to storage
  useEffect(() => {
    if (!notes) return;
    setItem(JSON.stringify(notes));
  }, [notes]);

  const addNote = (props: { text: string; priority: number }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const note = {
      id,
      text: props.text,
      priority: props.priority,
      date: new Date().toISOString(),
    };
    setNotes((notes) => [...notes, note]);
  };

  const deleteNote = (id: string) => {
    setNotes((notes) => notes.filter((note) => note.id !== id));
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
