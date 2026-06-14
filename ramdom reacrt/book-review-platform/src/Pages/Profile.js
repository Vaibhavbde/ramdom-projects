import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, updateUser, clearUser } from "../utils/auth";
import { getReviewedBooksForUser } from "../utils/reviewedBooks";
import { getSavedBooks } from "../utils/savedBooks";
import "../styles/Profile.css";
import { Heart, MessageSquareText } from "lucide-react";

const getInitials = (name = "") => {
  try {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "U";
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (first + last).toUpperCase();
  } catch {
    return "U";
  }
};

const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
};

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalReviews: 0, totalFavorites: 0 });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    avatarUrl: "",
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      navigate("/signin", { replace: true });
      return;
    }
    setUser(u);
    setForm({
      name: u.name || "",
      username: u.username || "",
      email: u.email || "",
      avatarUrl: u.avatarUrl || "",
    });

    // Load stats and update with current saved books and reviews count
    const updateStats = () => {
      const savedBooksCount = getSavedBooks().length;
      const reviewedBooksCount = getReviewedBooksForUser(u.name).length;
      setStats({
        totalReviews: reviewedBooksCount,
        totalFavorites: savedBooksCount,
      });
    };
    updateStats();

    // Listen for savedBooks and reviewedBooks updates to refresh counts
    const handleSavedBooksUpdate = () => {
      updateStats();
    };
    const handleReviewedBooksUpdate = () => {
      updateStats();
    };
    window.addEventListener("savedBooks:updated", handleSavedBooksUpdate);
    window.addEventListener("reviewedBooks:updated", handleReviewedBooksUpdate);
    return () => {
      window.removeEventListener("savedBooks:updated", handleSavedBooksUpdate);
      window.removeEventListener(
        "reviewedBooks:updated",
        handleReviewedBooksUpdate
      );
    };
  }, [navigate]);

  const initials = useMemo(() => getInitials(user?.name), [user?.name]);
  if (!user) return null;
  return (
    <main className="profile-page">
      <div className="profile-header">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={`${user.name}'s profile`}
            className="profile-avatar profile-avatar-image"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="profile-avatar" aria-hidden>
            {initials}
          </div>
        )}
        <div className="profile-identity">
          <div className="profile-headline">
            <h2 className="profile-name">{user.name}</h2>
            <div className="profile-action-buttons">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditing((e) => !e);
                  setSaved(false);
                  setError("");
                }}
              >
                {editing ? "Cancel" : "Edit Profile"}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  clearUser();
                  navigate("/signin", { replace: true });
                }}
              >
                Log out
              </button>
            </div>
          </div>
          <div className="profile-username">@{user.username}</div>
          <div className="profile-subtle">
            Joined {formatDate(user.signedInAt)}
          </div>
        </div>
      </div>

      {editing ? (
        <section className="profile-section">
          <h3 className="section-title">Edit your details</h3>
          {error && <div className="form-error">{error}</div>}
          {saved && <div className="form-success">Saved!</div>}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                className="form-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                className="form-input"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="yourhandle"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div className="form-actions">
            <button
              className="btn btn-primary"
              onClick={() => {
                // basic validation
                if (
                  !form.name.trim() ||
                  !form.username.trim() ||
                  !form.email.trim()
                ) {
                  setError("All fields are required.");
                  setSaved(false);
                  return;
                }
                const emailOk = /\S+@\S+\.\S+/.test(form.email);
                if (!emailOk) {
                  setError("Please enter a valid email.");
                  setSaved(false);
                  return;
                }
                const updated = updateUser({
                  name: form.name.trim(),
                  username: form.username.trim(),
                  email: form.email.trim(),
                  avatarUrl: form.avatarUrl.trim(),
                });
                if (updated) {
                  setUser(updated);
                  setSaved(true);
                  setError("");
                  window.dispatchEvent(new Event("user:updated"));
                }
              }}
            >
              Save Changes
            </button>
          </div>
        </section>
      ) : (
        <section className="profile-section">
          <h3 className="section-title">Account</h3>
          <div className="info-grid">
            <div className="info-card">
              <p className="info-label">Email</p>
              <p className="info-value">{user.email}</p>
            </div>
            <div className="info-card">
              <p className="info-label">Display Name</p>
              <p className="info-value">{user.name}</p>
            </div>
            <div className="info-card">
              <p className="info-label">Username</p>
              <p className="info-value">@{user.username}</p>
            </div>
          </div>
        </section>
      )}

      <section className="profile-section">
        <h3 className="section-title">Your stats</h3>
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon" aria-hidden>
              <MessageSquareText size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Reviews</span>
              <span className="stat-value">{stats.totalReviews}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" aria-hidden>
              <Heart size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Saved</span>
              <span className="stat-value">{stats.totalFavorites}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
