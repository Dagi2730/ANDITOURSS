import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessages, markMessageRead, deleteMessage } from '../../features/message/adminMessageSlice';

function AdminMessages() {
  const dispatch = useDispatch();
  const { messages, isLoading } = useSelector((state) => state.adminMessage);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    dispatch(getMessages());
  }, [dispatch]);

  const handleExpand = (msg) => {
    const opening = expandedId !== msg.id;
    setExpandedId(opening ? msg.id : null);
    if (opening && !msg.isRead) {
      dispatch(markMessageRead(msg.id));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message?')) {
      try {
        await dispatch(deleteMessage(id)).unwrap();
      } catch (err) {
        alert('Failed to delete message');
      }
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="amsg-wrapper">
      <div className="amsg-header">
        <div>
          <h2 className="amsg-heading">Contact Messages</h2>
          <p className="amsg-subheading">
            Messages submitted through the public Contact page.
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="amsg-unread-pill">{unreadCount} Unread</span>
        )}
      </div>

      <div className="amsg-list">
        {isLoading && messages.length === 0 ? (
          <div className="amsg-empty">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="amsg-empty">
            <div className="amsg-empty-icon">✉️</div>
            <h3>No messages yet</h3>
            <p>Submissions from the Contact page will show up here.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`amsg-row ${!msg.isRead ? 'amsg-unread' : ''}`}
            >
              <div className="amsg-row-main" onClick={() => handleExpand(msg)}>
                <div className="amsg-row-top">
                  {!msg.isRead && <span className="amsg-dot" />}
                  <span className="amsg-name">{msg.name}</span>
                  <span className="amsg-email">{msg.email}</span>
                  <span className="amsg-date">
                    {new Date(msg.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="amsg-subject">{msg.subject}</div>

                {expandedId === msg.id && (
                  <div className="amsg-body">{msg.message}</div>
                )}
              </div>

              <div className="amsg-actions">
                <button
                  className="amsg-btn-expand"
                  onClick={() => handleExpand(msg)}
                >
                  {expandedId === msg.id ? 'Collapse' : 'View'}
                </button>
                <button
                  className="amsg-btn-delete"
                  onClick={() => handleDelete(msg.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .amsg-wrapper { padding: 20px; font-family: 'Inter', sans-serif; }

        .amsg-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          flex-wrap: wrap; gap: 12px; margin-bottom: 24px;
        }
        .amsg-heading { margin: 0 0 4px; font-size: 1.4rem; font-weight: 700; }
        .amsg-subheading { margin: 0; color: #6b6a63; font-size: 0.9rem; }

        .amsg-unread-pill {
          background: #B5651D; color: #fff; font-weight: 700; font-size: 0.8rem;
          padding: 6px 14px; border-radius: 999px;
        }

        .amsg-list { display: flex; flex-direction: column; gap: 10px; }

        .amsg-row {
          display: flex; justify-content: space-between; align-items: flex-start;
          background: #fff; border: 1px solid #eee; border-radius: 10px; padding: 14px 16px;
        }
        .amsg-unread { background: #fbf8f2; border-color: #eee0c8; }

        .amsg-row-main { flex: 1; cursor: pointer; min-width: 0; }

        .amsg-row-top { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 4px; }
        .amsg-dot { width: 8px; height: 8px; border-radius: 50%; background: #B5651D; flex-shrink: 0; }
        .amsg-name { font-weight: 700; font-size: 0.92rem; }
        .amsg-email { font-size: 0.82rem; color: #8a8878; }
        .amsg-date { font-size: 0.78rem; color: #aaa; margin-left: auto; }

        .amsg-subject { font-size: 0.9rem; font-weight: 600; color: #556B2F; }

        .amsg-body {
          margin-top: 10px; padding: 12px; background: #f9f9f7; border-radius: 8px;
          font-size: 0.88rem; line-height: 1.6; color: #444; white-space: pre-wrap;
        }

        .amsg-actions { display: flex; flex-direction: column; gap: 6px; margin-left: 12px; }
        .amsg-btn-expand {
          border: 1px solid #ddd; background: #fff; border-radius: 6px; padding: 6px 12px;
          font-size: 0.8rem; cursor: pointer; font-weight: 600; color: #444;
        }
        .amsg-btn-delete {
          border: none; background: #fdecea; color: #c0392b; border-radius: 6px;
          padding: 6px 10px; cursor: pointer; font-size: 0.85rem;
        }

        .amsg-empty {
          text-align: center; padding: 60px 20px; color: #8a8878; background: #fff;
          border-radius: 12px; border: 1px dashed #ddd;
        }
        .amsg-empty-icon { font-size: 2.4rem; margin-bottom: 10px; opacity: 0.6; }

        @media (max-width: 640px) {
          .amsg-row { flex-direction: column; }
          .amsg-actions { flex-direction: row; margin-left: 0; margin-top: 10px; }
        }
      `}</style>
    </div>
  );
}

export default AdminMessages;