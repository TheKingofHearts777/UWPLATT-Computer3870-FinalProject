import { useState } from "react";
import { Button, Form } from "react-bootstrap";

export default function LoginView({ setCurrentView }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSignup = async (event) => {
        event.preventDefault();
        const signupButton = document.getElementById("signup2");
        const backButton = document.getElementById("back");
        backButton.disabled = true;
        signupButton.disabled = true;

        const inputs = document.querySelectorAll("input");
        inputs.forEach(input => input.disabled = true);
        
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

            signupButton.disabled = false;
            backButton.disabled = false;
            inputs.forEach(input => input.disabled = false);

            localStorage.setItem("token", data.token);
            setCurrentView("login");
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error("Signup error:", err);
        }
    }

    const handleBack = (event) => {
        event.preventDefault();
        setCurrentView("login");
    }

    return (
        <div className="signup-container" style={{justifyItems: "center"}}>
            <Form onSubmit={handleSignup} className="menu-container">
                <h1>Signup</h1>
                <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="username"
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
                <Button id="signup2" style={{backgroundColor: "green", borderColor: "green", margin: "10px"}} type="submit" onClick={handleSignup}>
                    Signup
                </Button>
                <Button id="back" style={{backgroundColor: "green", borderColor: "green", margin: "10px"}} type="submit" onClick={handleBack}>
                    Back
                </Button>
            </Form>
        </div>
    );
}