import { Trash2, NotepadText } from 'lucide-react';
import { useState } from 'react';

export function NotesPanel() {
  const [notes, setNotes] = useState([
    { id: 1, text: 'Follow up with client about project timeline' },
    { id: 2, text: 'Review marketing budget for Q2' },
  ]);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        text: newNote.trim()
      };
      setNotes([...notes, note]);
      setNewNote('');
    }
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div>
      <h3 className="flex items-center gap-2 text-base font-semibold text-[#051046] mb-4">
        <NotepadText className="w-5 h-5" style={{ color: '#8b5cf6' }} />
        Notes
      </h3>
      
      {/* Notes Input */}
      <div className="mb-4">
        <textarea
          placeholder="Type here..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full h-24 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400"
        />
      </div>

      {/* Add Note Button */}
      <button 
        onClick={handleAddNote}
        className="w-full bg-[#9473ff] hover:bg-[#7f5fd9] text-white font-medium py-3 rounded-[32px] text-sm transition-colors mb-4"
      >
        Add note
      </button>

      {/* Notes List */}
      <div 
        style={{
          maxHeight: notes.length > 3 ? '200px' : 'none',
          overflowY: notes.length > 3 ? 'scroll' : 'visible',
          paddingRight: notes.length > 3 ? '4px' : '0'
        }}
      >
        <div className="space-y-2">
          {notes.map((note) => (
            <div key={note.id} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
              <p className="flex-1 text-sm text-gray-700">{note.text}</p>
              <button 
                onClick={() => handleDeleteNote(note.id)}
                className="text-[rgb(153,161,175)] hover:text-orange-600 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}