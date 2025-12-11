import { useState } from "react";
import { Button, Form } from "react-bootstrap";

export default function LoginView({ setCurrentView }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    async function handleLogin(event) {
        event.preventDefault();
        const loginButton = document.getElementById("login");
        loginButton.disabled = true;

        const inputs = document.querySelectorAll("input");
        inputs.forEach(input => input.disabled = true);
        
        try {
            const response = await fetch("https://uwplatt-computer3870-finalproject-backend.onrender.com/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Login failed");
                return;
            }

            // Store token and navigate to home
            localStorage.setItem("token", data.token);
            setCurrentView("home");
        } catch (err) {
            setError("An error occurred during login");
            console.error("Login error:", err);
        }
    }

    function handleSignup(event) {
        event.preventDefault();
        setCurrentView("signup");
    }

    function handleGuestPlay(event) {
        event.preventDefault();
        setCurrentView("home");
    }

    return (
        <div className="login-container" style={{justifyItems: "center"}}>
            <Form onSubmit={handleLogin} className="menu-container">
                <h1>Login</h1>
                <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onFocus={(e) => {
                            e.target.style.boxShadow = "0 0 10px rgba(0, 128, 0, 0.8)";
                            e.target.style.borderColor = "darkgreen";
                        }}
                        onBlur={(e) => {
                            e.target.style.boxShadow = "none";
                            e.target.style.borderColor = "";
                        }}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={(e) => {
                            e.target.style.boxShadow = "0 0 10px rgba(0, 128, 0, 0.8)";
                            e.target.style.borderColor = "darkgreen";
                        }}
                        onBlur={(e) => {
                            e.target.style.boxShadow = "none";
                            e.target.style.borderColor = "";
                        }}
                        required
                    />
                </Form.Group>
                {error && <p className="error-text">{error}</p>}
                <Button id="login" style={{backgroundColor: "green", borderColor: "green", margin: "10px"}} type="submit" onClick={handleLogin}>
                    Login
                </Button>
                <Button id="signup"style={{backgroundColor: "green", borderColor: "green", margin: "10px"}} type="submit" onClick={handleSignup}>
                    Signup
                </Button>
                <Button id="guest" style={{backgroundColor: "green", borderColor: "green", margin: "10px"}} type="submit" onClick={handleGuestPlay}>
                    Play as Guest
                </Button>
            </Form>
        </div>
    );
}