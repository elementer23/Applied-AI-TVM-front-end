import React, { useEffect, useState } from "react";
import { GetAllUsers, UpdateUser, DeleteUser, RegisterUser } from "../utils/Services";
import "../css/UserManagement.css";


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const users = await GetAllUsers();
      setUsers(users);
      setLoading(false);
    } catch (err) {
      setFeedback("Kan gebruikers niet ophalen!");
      setLoading(false);
    }
  }

  function handleEdit(user) {
    setEditing(user.id);
    setEditRole(user.role);
    setEditPassword("");
    setFeedback("");
  }

  async function handleUpdate(user) {
    setLoading(true);
    try {
      await UpdateUser(user.id, { role: editRole, password: editPassword || undefined });
      setEditing(null);
      setFeedback("Gebruiker bijgewerkt!");
      loadUsers();
    } catch {
      setFeedback("Bijwerken mislukt!");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(user) {
    if (window.confirm(`Weet je zeker dat je ${user.username} wilt verwijderen?`)) {
      setLoading(true);
      try {
        await DeleteUser(user.id);
        setFeedback("Gebruiker verwijderd!");
        loadUsers();
      } catch {
        setFeedback("Verwijderen mislukt!");
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    setFeedback("");
    if (!newUser.username || !newUser.password) {
      setFeedback("Gebruikersnaam en wachtwoord verplicht!");
      setLoading(false);
      return;
    }
    try {
      await RegisterUser(newUser);
      setFeedback("Gebruiker aangemaakt!");
      setNewUser({ username: "", password: "", role: "user" });
      loadUsers();
    } catch {
      setFeedback("Aanmaken mislukt!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="user-mgmt-container">
      <h2>Gebruikersbeheer</h2>
      {feedback && <div style={{ color: feedback.includes("mislukt") ? "red" : "green" }}>{feedback}</div>}
      {loading && <div>Even geduld...</div>}

      <form onSubmit={handleCreate} style={{ marginBottom: "1em" }}>
        <h4>Nieuwe gebruiker toevoegen</h4>
        <input
          placeholder="Gebruikersnaam"
          value={newUser.username}
          onChange={e => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Wachtwoord"
          value={newUser.password}
          onChange={e => setNewUser({ ...newUser, password: e.target.value })}
        />
        <select
          value={newUser.role}
          onChange={e => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        <button type="submit" disabled={loading}>Toevoegen</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Gebruikersnaam</th>
            <th>Rol</th>
            <th>Acties</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>
                {editing === u.id ? (
                  <select value={editRole} onChange={e => setEditRole(e.target.value)}>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                ) : (
                  u.role
                )}
              </td>
              <td>
                {editing === u.id ? (
                  <>
                    <input
                      type="password"
                      placeholder="Nieuw wachtwoord (optioneel)"
                      value={editPassword}
                      onChange={e => setEditPassword(e.target.value)}
                    />
                    <button onClick={() => handleUpdate(u)} disabled={loading}>Opslaan</button>
                    <button onClick={() => setEditing(null)} disabled={loading}>Annuleren</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(u)} disabled={loading}>Bewerken</button>
                    <button onClick={() => handleDelete(u)} disabled={loading}>Verwijderen</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
