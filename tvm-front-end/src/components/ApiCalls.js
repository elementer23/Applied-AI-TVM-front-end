import axios from "axios";

const API_BASE = "http://localhost:8000";

export async function loginUser(username, password) {
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);

  const response = await axios.post(`${API_BASE}/token`, form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const token = response.data.access_token;
  sessionStorage.setItem("token", token);
  return token;
}

export async function getAdvies(input) {
  const token = sessionStorage.getItem("token");

  if (!token) {
    throw new Error("Niet ingelogd");
  }

  const response = await axios.post(
    `${API_BASE}/run`,
    { input },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.output;
}
