import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import NoteModal from './components/NoteModal';
import './App.css';

function App() {
  // Authentication states
  const [showRegister, setShowRegister] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Notes states
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  // const [searchTerm, setSearchTerm] = useState('');
  // const [filteredNotes, setFilteredNotes] = useState([]);

  // Search states  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState([]);

  // Keep filteredNotes in sync with notes and searchTerm
  useEffect(() => {
    console.log('🔍 Search triggered:', searchTerm);

    if (searchTerm.trim() === '') {
      console.log('✅ Empty search - showing all notes');
      setFilteredNotes(notes);
    } else {
      console.log('🔎 Searching keywords for:', searchTerm);
      searchByKeywords(searchTerm);
    }
  }, [notes, searchTerm]);

  // Add this new function


  // Add this new function
  // const searchInBackend = async (searchValue) => {
  //   try {
  //     const res = await fetch(`http://localhost:8000/notes/search?q=${encodeURIComponent(searchValue)}`);
  //     if (res.ok) {
  //       const searchResults = await res.json();
  //       setFilteredNotes(searchResults);
  //     }
  //   // eslint-disable-next-line no-unused-vars
  //   } catch (error) {
  //     // Fallback to date search if backend fails
  //     const searchLower = searchValue.toLowerCase();
  //     const filtered = notes.filter(note => {
  //       const createdAt = new Date(note.created_at).toLocaleDateString().toLowerCase();
  //       return createdAt.includes(searchLower);
  //     });
  //     setFilteredNotes(filtered);
  //   }
  // };


  // Fetch all notes
  const fetchAllNotes = async () => {
    try {
      const res = await fetch('http://localhost:8000/notes/');
      if (res.ok) {
        const allNotes = await res.json();
        setNotes(allNotes);
        // setFilteredNotes(allNotes);
      }
    } catch (error) {
      console.log("Error fetching notes " + error.message);
    }
  };

  // View note content in modal
  const viewNoteContent = async (noteId) => {
    try {
      const res = await fetch(`http://localhost:8000/notes/${noteId}`);
      if (res.ok) {
        const decryptedNote = await res.json();
        setSelectedNote(decryptedNote);
      } else {
        const errorData = await res.json();
        alert("Error viewing note: " + (errorData.detail || "Unknown error"));
      }
    } catch (error) {
      alert("Error viewing note (network or server error) " + error.message);
    }
  };

  // Registration handler
  const handleRegister = async (username, password) => {
    setRegisterError('');
    try {
      const res = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        setShowRegister(false);
        alert('Registration successful! Please log in.');
      } else {
        const errorData = await res.json();
        setRegisterError(errorData.detail || 'Registration failed');
      }
    } catch (error) {
      setRegisterError('Network error. Please try again. ' + error.message);
    }
  };

  // Login handler
  const handleLogin = async (username, password) => {
    setLoginError('');
    try {
      const res = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        setIsLoggedIn(true);
        fetchAllNotes();
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      setLoginError('Network error. Please try again. ' + error.message);
    }
  };

  // Note creation handler
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await fetch('http://localhost:8000/notes/', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ content, keywords })
  //     });
  //     const data = await res.json();
  //     setNotes([...notes, data]);
  //     setContent('');
  //     setKeywords('');
  //   } catch (error) {
  //     alert('Error creating note. Please try again. '+error.message);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/notes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, keywords })
      });
      const data = await res.json();
      const updatedNotes = [...notes, data];
      setNotes(updatedNotes);
      // setFilteredNotes(updatedNotes); 
      setContent('');
      setKeywords('');
    } catch (error) {
      alert('Error creating note. Please try again. ' + error);
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setNotes([]);
  };
  // Search function
  // const handleSearch = (searchValue) => {
  //   setSearchTerm(searchValue);

  //   if (searchValue.trim() === '') {
  //     setFilteredNotes(notes); // Show all notes if search is empty
  //   } else {
  //     const filtered = notes.filter(note => {
  //       // Search in encrypted keywords (you'll need to decrypt them to search)
  //       // For now, let's search in the creation date and content preview
  //       const searchLower = searchValue.toLowerCase();
  //       const createdAt = new Date(note.created_at).toLocaleDateString().toLowerCase();
  //       const contentPreview = note.encrypted_content.slice(0, 50).toLowerCase();

  //       return createdAt.includes(searchLower) ||
  //         contentPreview.includes(searchLower);
  //     });
  //     setFilteredNotes(filtered);
  //   }
  // };
  // const handleSearch = async (searchValue) => {
  //   setSearchTerm(searchValue);

  //   if (searchValue.trim() === '') {
  //     setFilteredNotes(notes);
  //   } else {
  //     try {
  //       const res = await fetch(`http://localhost:8000/notes/search?q=${encodeURIComponent(searchValue)}`);
  //       if (res.ok) {
  //         const searchResults = await res.json();
  //         setFilteredNotes(searchResults);
  //       }
  //       // eslint-disable-next-line no-unused-vars
  //     } catch (error) {
  //       // Fallback to local filtering
  //       const filtered = notes.filter(note => {
  //         const searchLower = searchValue.toLowerCase();
  //         const createdAt = new Date(note.created_at).toLocaleDateString().toLowerCase();
  //         return createdAt.includes(searchLower);
  //       });
  //       setFilteredNotes(filtered);
  //     }
  //   }
  // };
  // Simplified search handler
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };
  // Search by keywords using backend
  const searchByKeywords = async (searchValue) => {
    try {
      console.log('🌐 Calling backend search...');
      const res = await fetch(`http://localhost:8000/notes/search?q=${encodeURIComponent(searchValue)}`);

      if (res.ok) {
        const searchResults = await res.json();
        console.log('✅ Search results:', searchResults.length, 'notes found');
        setFilteredNotes(searchResults);
      } else {
        console.log('❌ Backend search failed');
        setFilteredNotes([]);
      }
    } catch (error) {
      console.log('❌ Network error:', error);
      // Fallback to show no results
      setFilteredNotes([]);
    }
  };


  // Main render
  return (
    <div className="app-container">
      {isLoggedIn ? (
        // Notes UI (when logged in)
        <>
          <div className="app-header">
            <h1 className="app-title">🔒 Encrypted Notes</h1>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <form className="note-form" onSubmit={handleSubmit}>
            <textarea
              className="form-textarea"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your encrypted note here..."
              required
            />
            <input
              className="form-input"
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder="Keywords (comma separated)"
            />
            <button type="submit" className="save-btn">
              💾 Save Encrypted Note
            </button>
          </form>

          <div className="notes-section">
            <h2 className="notes-title">Your Encrypted Notes</h2>

            {/* ADD THIS SEARCH BAR */}
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="🔍 Search notes..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchTerm && (
                <div className="search-results-info">
                  Showing {filteredNotes.length} of {notes.length} notes
                </div>
              )}
            </div>


            {filteredNotes.length === 0 ? (
              <p className="empty-state">
                {searchTerm ? 'No notes found matching your search.' : 'No notes yet. Create your first encrypted note above!'}
              </p>
            ) : (
              <ul className="notes-list">
                {filteredNotes.map(note => (
                  <li key={note.id} className="note-item">
                    <div className="note-meta">
                      Created: {new Date(note.created_at).toLocaleDateString()}
                    </div>
                    <div className="note-preview">
                      Encrypted: {note.encrypted_content.slice(0, 50)}...
                    </div>
                    <button
                      className="view-btn"
                      onClick={() => viewNoteContent(note.id)}
                    >
                      🔓 View Content
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>


          {/* Note Modal */}
          {selectedNote && (
            <NoteModal
              note={selectedNote}
              onClose={() => setSelectedNote(null)}
            />
          )}
        </>
      ) : (
        // Login/Register UI (when not logged in)
        <div className="auth-container">
          {showRegister ? (
            <div>
              <RegisterForm onRegister={handleRegister} error={registerError} />
              <div className="auth-toggle">
                Already have an account?{' '}
                <button
                  className="auth-link"
                  onClick={() => {
                    setShowRegister(false);
                    setRegisterError('');
                  }}
                >
                  Login
                </button>
              </div>
            </div>
          ) : (
            <div>
              <LoginForm onLogin={handleLogin} error={loginError} />
              <div className="auth-toggle">
                Don't have an account?{' '}
                <button
                  className="auth-link"
                  onClick={() => {
                    setShowRegister(true);
                    setLoginError('');
                  }}
                >
                  Register
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
