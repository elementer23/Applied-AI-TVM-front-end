import { useEffect, useState } from "react";
import { GetAllUsers, UpdateUser, DeleteUser, RegisterUser } from "../utils/Services";
import Header from "./Header";
import "../css/UserManagement.css";

// Helper om errors altijd als string te tonen
function parseErrorDetail(detail) {
    if (!detail) return "Onbekende fout";
    if (Array.isArray(detail)) {
        return detail.map(d => d.msg || JSON.stringify(d)).join(" | ");
    }
    if (typeof detail === "object") {
        return JSON.stringify(detail);
    }
    return detail.toString();
}

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editForm, setEditForm] = useState({ username: "", role: "", password: "" });
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);

    // Nieuw voor gebruiker toevoegen
    const [showAddForm, setShowAddForm] = useState(false);
    const [addForm, setAddForm] = useState({ username: "", password: "", role: "user" });

    // Laad gebruikerslijst
    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await GetAllUsers();
            setUsers(data);
        } catch (e) {
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
        setFeedback("");
        try {
            await UpdateUser(userId, {
                username: editForm.username,
                role: editForm.role,
                password: editForm.password || undefined,
            });
            setFeedback("Gebruiker bijgewerkt!");
            setEditingUserId(null);
            loadUsers();
        } catch (err) {
            // Custom error parsing
            const detail = err?.response?.data?.detail || err?.message;
            setFeedback(parseErrorDetail(detail));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Weet je zeker dat je deze gebruiker wilt verwijderen?")) return;
        setLoading(true);
        setFeedback("");
        try {
            await DeleteUser(userId);
            setFeedback("Gebruiker verwijderd!");
            loadUsers();
        } catch (err) {
            const detail = err?.response?.data?.detail || err?.message;
            setFeedback(parseErrorDetail(detail));
        } finally {
            setLoading(false);
        }
    };

    // Nieuw: handler voor gebruiker toevoegen
    const handleAddChange = (e) => {
        setAddForm({ ...addForm, [e.target.name]: e.target.value });
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback("");
        try {
            const res = await RegisterUser({
                username: addForm.username,
                password: addForm.password,
                role: addForm.role,
            });
            if (res.success) {
                setFeedback("Gebruiker aangemaakt!");
                setShowAddForm(false);
                setAddForm({ username: "", password: "", role: "user" });
                loadUsers();
            } else {
                setFeedback(parseErrorDetail(res.message));
            }
        } catch (err) {
            const detail = err?.response?.data?.detail || err?.message;
            setFeedback(parseErrorDetail(detail));
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
                    {/* Feedback */}
                    {feedback && (
                        <div className="beheer-feedback">{feedback}</div>
                    )}

                    {/* Gebruiker toevoegen knop */}
                    <button
                        className="beheer-btn beheer-btn-blue"
                        style={{ marginBottom: "16px" }}
                        onClick={() => setShowAddForm(v => !v)}
                        disabled={loading}
                    >
                        {showAddForm ? "Annuleer" : "Gebruiker aanmaken"}
                    </button>

                    {/* Gebruiker toevoegen formulier */}
                    {showAddForm && (
                        <form
                            className="beheer-add-form"
                            style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}
                            onSubmit={handleAddUser}
                        >
                            <input
                                className="beheer-input"
                                placeholder="Gebruikersnaam"
                                name="username"
                                required
                                value={addForm.username}
                                onChange={handleAddChange}
                            />
                            <input
                                className="beheer-input"
                                placeholder="Wachtwoord"
                                name="password"
                                type="password"
                                required
                                value={addForm.password}
                                onChange={handleAddChange}
                            />
                            <select
                                className="beheer-input"
                                name="role"
                                value={addForm.role}
                                onChange={handleAddChange}
                            >
                                <option value="user">user</option>
                                <option value="admin">admin</option>
                            </select>
                            <button className="beheer-btn beheer-btn-green" type="submit" disabled={loading}>
                                Toevoegen
                            </button>
                        </form>
                    )}

                    {/* Bestaande gebruikers tabel */}
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
