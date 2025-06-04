import { useEffect, useState } from "react";
import { GetAllUsers, UpdateUser, DeleteUser } from "../utils/Services";
import Header from "./Header";
import "../css/UserManagement.css"; 

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editForm, setEditForm] = useState({ username: "", role: "", password: "" });
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await GetAllUsers();
            setUsers(data);
        } catch {
            setFeedback("Kon gebruikers niet laden.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const startEdit = (user) => {
        setEditingUserId(user.id);
        setEditForm({ username: user.username, role: user.role, password: "" });
        setFeedback("");
    };

    const cancelEdit = () => {
        setEditingUserId(null);
        setEditForm({ username: "", role: "", password: "" });
        setFeedback("");
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (userId) => {
        setLoading(true);
        try {
            await UpdateUser(userId, {
                username: editForm.username,
                role: editForm.role,
                password: editForm.password || undefined, // Stuur alleen als ingevuld
            });
            setFeedback("Gebruiker bijgewerkt!");
            setEditingUserId(null);
            loadUsers();
        } catch (err) {
            setFeedback("Bijwerken mislukt!");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Weet je zeker dat je deze gebruiker wilt verwijderen?")) return;
        setLoading(true);
        try {
            await DeleteUser(userId);
            setFeedback("Gebruiker verwijderd!");
            loadUsers();
        } catch {
            setFeedback("Verwijderen mislukt!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header variant="beheer" />
            <div className="user-management-centerwrap">
                <div className="user-management-content">
                    <h1 className="beheer-title">Gebruikersbeheer</h1>
                    {feedback && <div className="beheer-feedback">{feedback}</div>}
                    <table className="beheer-table">
                        <thead>
                            <tr>
                                <th>Gebruikersnaam</th>
                                <th>Rol</th>
                                <th>Wijzig</th>
                                <th>Verwijder</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className={editingUserId === user.id ? "beheer-row-editing" : ""}>
                                    <td>
                                        {editingUserId === user.id ? (
                                            <input
                                                name="username"
                                                value={editForm.username}
                                                onChange={handleEditChange}
                                                className="beheer-input"
                                            />
                                        ) : (
                                            user.username
                                        )}
                                    </td>
                                    <td>
                                        {editingUserId === user.id ? (
                                            <select
                                                name="role"
                                                value={editForm.role}
                                                onChange={handleEditChange}
                                                className="beheer-input"
                                            >
                                                <option value="user">user</option>
                                                <option value="admin">admin</option>
                                            </select>
                                        ) : (
                                            user.role
                                        )}
                                    </td>
                                    <td>
                                        {editingUserId === user.id ? (
                                            <div className="beheer-edit-controls">
                                                <input
                                                    type="password"
                                                    name="password"
                                                    placeholder="Nieuw wachtwoord (optioneel)"
                                                    value={editForm.password}
                                                    onChange={handleEditChange}
                                                    className="beheer-input"
                                                />
                                                <button
                                                    onClick={() => handleUpdate(user.id)}
                                                    disabled={loading}
                                                    className="beheer-btn beheer-btn-green"
                                                >
                                                    Opslaan
                                                </button>
                                                <button onClick={cancelEdit} className="beheer-btn beheer-btn-grey">Annuleer</button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => startEdit(user)}
                                                className="beheer-btn beheer-btn-blue"
                                            >
                                                Wijzig
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="beheer-btn beheer-btn-red"
                                            disabled={loading}
                                        >
                                            Verwijder
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading && <div className="beheer-loader">Laden...</div>}
                </div>
            </div>
        </>
    );
}

export default UserManagement;
