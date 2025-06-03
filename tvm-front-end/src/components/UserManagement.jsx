import React, { useEffect, useState } from "react";
import { GetAllUsers, UpdateUser, DeleteUser } from "../utils/Services";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [editPassword, setEditPassword] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
  const users = await GetAllUsers();
  setUsers(users);
} catch (err) {
  alert("Kan gebruikers niet ophalen!\n" + JSON.stringify(err));
}

  }

  function handleEdit(user) {
    setEditing(user.id);
    setEditRole(user.role);
    setEditPassword("");
  }

  async function handleUpdate(user) {
    await UpdateUser(user.id, { role: editRole, password: editPassword || undefined });
    setEditing(null);
    loadUsers();
  }

  async function handleDelete(user) {
    if (window.confirm(`Weet je zeker dat je ${user.username} wilt verwijderen?`)) {
      await DeleteUser(user.id);
      loadUsers();
    }
  }

  return (
    <div className="user-mgmt-container">
      <h2>Gebruikersbeheer</h2>
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
                    <button onClick={() => handleUpdate(u)}>Opslaan</button>
                    <button onClick={() => setEditing(null)}>Annuleren</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(u)}>Bewerken</button>
                    <button onClick={() => handleDelete(u)}>Verwijderen</button>
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
