const { useState, useEffect } = React;

// Simple icon components (replacing lucide-react to reduce dependencies)
const Icon = ({ name, size = 20, className = "" }) => {
  const icons = {
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"></polyline></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    bold: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>,
    italic: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>,
    list: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
    tag: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>,
    hash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>
  };
  return icons[name] || null;
};

function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');

  useEffect(() => {
    const savedNotes = [
      {
        id: 1,
        title: 'Welcome to Notes App',
        content: 'This is your first note! Start creating, editing, and organizing your thoughts.\n\nFeatures:\n• Rich text formatting\n• Tag organization\n• Quick search\n• Clean, modern interface',
        tags: ['welcome', 'tutorial'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    setNotes(savedNotes);
    setSelectedNote(savedNotes[0]);
  }, []);

  const createNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'Untitled Note',
      content: '',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsEditing(true);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setEditTags('');
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    if (selectedNote?.id === id) {
      setSelectedNote(updatedNotes[0] || null);
    }
  };

  const startEditing = () => {
    if (selectedNote) {
      setIsEditing(true);
      setEditTitle(selectedNote.title);
      setEditContent(selectedNote.content);
      setEditTags(selectedNote.tags.join(', '));
    }
  };

  const saveEdit = () => {
    if (selectedNote) {
      const updatedNote = {
        ...selectedNote,
        title: editTitle || 'Untitled Note',
        content: editContent,
        tags: editTags.split(',').map(t => t.trim()).filter(t => t),
        updatedAt: new Date().toISOString()
      };
      const updatedNotes = notes.map(note => 
        note.id === selectedNote.id ? updatedNote : note
      );
      setNotes(updatedNotes);
      setSelectedNote(updatedNote);
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const applyFormatting = (format) => {
    const textarea = document.getElementById('note-content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editContent.substring(start, end);
    
    let formattedText = '';
    switch(format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'list':
        formattedText = `• ${selectedText}`;
        break;
      default:
        formattedText = selectedText;
    }
    
    const newContent = editContent.substring(0, start) + formattedText + editContent.substring(end);
    setEditContent(newContent);
  };

  const allTags = [...new Set(notes.flatMap(note => note.tags))];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !filterTag || note.tags.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  const renderContent = (content) => {
    return content.split('\n').map((line, i) => {
      let processedLine = line;
      processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      processedLine = processedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      return React.createElement('p', { 
        key: i, 
        dangerouslySetInnerHTML: { __html: processedLine || '<br/>' } 
      });
    });
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="app-title">
            <Icon name="edit" size={28} />
            My Notes
          </h1>
          
          <div className="search-box">
            <Icon name="search" size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {allTags.length > 0 && (
            <div className="tag-filters">
              <button
                onClick={() => setFilterTag('')}
                className={`tag-filter-btn ${!filterTag ? 'active' : ''}`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`tag-filter-btn ${filterTag === tag ? 'active' : ''}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="notes-list">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              onClick={() => { setSelectedNote(note); setIsEditing(false); }}
              className={`note-item ${selectedNote?.id === note.id ? 'selected' : ''}`}
            >
              <div className="note-item-header">
                <h3 className="note-title">{note.title}</h3>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                  className="delete-btn"
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
              <p className="note-preview">
                {note.content || 'No content'}
              </p>
              <div className="note-date">
                <Icon name="calendar" size={12} />
                {formatDate(note.updatedAt)}
              </div>
              {note.tags.length > 0 && (
                <div className="note-tags">
                  {note.tags.map(tag => (
                    <span key={tag} className="note-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="new-note-section">
          <button onClick={createNote} className="new-note-btn">
            <Icon name="plus" size={20} />
            New Note
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {selectedNote ? (
          <>
            <div className="note-header">
              <div className="note-header-content">
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="edit-title-input"
                      placeholder="Note title..."
                    />
                    <div className="tag-input-wrapper">
                      <Icon name="hash" size={16} />
                      <input
                        type="text"
                        value={editTags}
                        onChange={(e) => setEditTags(e.target.value)}
                        placeholder="Tags (comma separated)"
                        className="tag-input"
                      />
                    </div>
                    <div className="edit-actions">
                      <button onClick={saveEdit} className="save-btn">
                        <Icon name="check" size={18} />
                        Save
                      </button>
                      <button onClick={cancelEdit} className="cancel-btn">
                        <Icon name="x" size={18} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="view-header">
                      <h2 className="view-title">{selectedNote.title}</h2>
                      <button onClick={startEditing} className="edit-btn">
                        <Icon name="edit" size={18} />
                        Edit
                      </button>
                    </div>
                    <div className="note-meta">
                      <div className="meta-item">
                        <Icon name="calendar" size={14} />
                        Updated {formatDate(selectedNote.updatedAt)}
                      </div>
                      {selectedNote.tags.length > 0 && (
                        <div className="view-tags">
                          <Icon name="tag" size={14} />
                          {selectedNote.tags.map(tag => (
                            <span key={tag} className="view-tag">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="note-body">
              <div className="note-body-content">
                {isEditing ? (
                  <div>
                    <div className="formatting-toolbar">
                      <button
                        onClick={() => applyFormatting('bold')}
                        className="format-btn"
                        title="Bold"
                      >
                        <Icon name="bold" size={18} />
                      </button>
                      <button
                        onClick={() => applyFormatting('italic')}
                        className="format-btn"
                        title="Italic"
                      >
                        <Icon name="italic" size={18} />
                      </button>
                      <button
                        onClick={() => applyFormatting('list')}
                        className="format-btn"
                        title="List"
                      >
                        <Icon name="list" size={18} />
                      </button>
                    </div>
                    <textarea
                      id="note-content"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="content-textarea"
                      placeholder="Start writing your note..."
                    />
                    <p className="format-hint">
                      Formatting: **bold**, *italic*, • list
                    </p>
                  </div>
                ) : (
                  <div className="note-content">
                    {selectedNote.content ? renderContent(selectedNote.content) : (
                      <p className="empty-content">No content yet. Click Edit to start writing.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-content">
              <Icon name="edit" size={64} className="empty-icon" />
              <h3 className="empty-title">No note selected</h3>
              <p className="empty-text">Select a note or create a new one to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.render(<NotesApp />, document.getElementById('root'));