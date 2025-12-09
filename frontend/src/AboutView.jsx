import { Button } from "react-bootstrap";

function AboutView({ setViewToHome }) {
    return (
        <div className="menu-container">
            <h1>CS3870 Secure Web Development, Fall 2025</h1>

            <p><strong>Date:</strong> 10/25/2025</p>
            <p><strong>Students:</strong> Dylan Brodie and Christian Gasmund</p>
            
            <p>
                <strong>Emails: </strong> 
                <a href="mailto:brodied@uwplatt.edu">brodied@uwplatt.edu</a>
                <a> and </a>
                <a href="mailto:gasmundc@uwplatt.edu">gasmundc@uwplatt.edu</a>
            </p>

            <Button className="menu-btn" onClick={setViewToHome}>Back to Main Menu</Button>
        </div>
    );
}

export default AboutView;
