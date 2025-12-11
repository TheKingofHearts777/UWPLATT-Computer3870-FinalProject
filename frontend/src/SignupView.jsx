import { useState } from "react";
import { Button, Form } from "react-bootstrap";

export default function LoginView({ setCurrentView }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSignup = async (event) => {
        event.preventDefault();
        const signupButton = document.getElementById("signup");
        signupButton.disabled = true;
        
        try {
            const backendUrl = `https://uwplatt-computer3870-finalproject-backend.onrender.com/signup`;

            const response = await fetch(backendUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
                return;
            }

            localStorage.setItem("token", data.token);
            setCurrentView("login");
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error("Signup error:", err);
        }
    }

    return (
        <div className="login-container" style={{justifyItems: "center"}}>
            <Form onSubmit={handleSignup} className="menu-container">
                <h1>Signup</h1>
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
                <Button id="signup" style={{backgroundColor: "green", borderColor: "green", margin: "10px"}} type="submit" onClick={handleSignup}>
                    Signup
                </Button>
            </Form>
        </div>
    );
}