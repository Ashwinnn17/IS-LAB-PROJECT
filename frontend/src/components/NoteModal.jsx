import React from 'react';

function NoteModal({ note, onClose }) {
  if (!note) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Note Details</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-section">
            <label className="modal-label">Content:</label>
            <div className="modal-text">{note.content}</div>
          </div>
          <div className="modal-section">
            <label className="modal-label">Keywords:</label>
            <div className="modal-text">{note.keywords || 'No keywords'}</div>
          </div>
          <div className="modal-section">
            <label className="modal-label">Created:</label>
            <div className="modal-text">{new Date(note.created_at).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteModal;
