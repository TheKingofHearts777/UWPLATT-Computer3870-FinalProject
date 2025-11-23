import { Button, Form } from "react-bootstrap";

const settings = {
    difficulty: {
        label: "Difficulty",
        values: {easy: "Easy", medium: "Medium", hard: "Hard"},
        default: "easy"
    },

    sound: {
        label: "Sound",
        values: {on: "On", off: "Off"},
        default: "off"
    }
};

function getDefaultSettings() {
    let defaultSettings = {};

    for (let settingKey of Object.keys(settings)) {
        defaultSettings[settingKey] = settings[settingKey].default;
    }

    return defaultSettings;
}

function createSettings() {

    function createDropdown(setting, settingKey) {
        return (
            <div className="d-flex align-items-center gap-3 mb-3">
                <Form.Label htmlFor={settingKey} style={{ margin: 0 }}>
                    {setting.label}:
                </Form.Label>

                <Form.Select id={settingKey} name={settingKey}>
                    {Object.keys(setting.values).map((valueKey) => {
                        return (
                            <option key={valueKey} value={valueKey}>
                                {setting.values[valueKey]}
                            </option>
                        )
                    })}
                </Form.Select>
            </div>
        );
    }
    
    const listSettings = Object.keys(settings).map((settingKey) => {
        const setting = settings[settingKey];

        return (
            <li key={settingKey} className="settings-item">
                {createDropdown(setting, settingKey)}
            </li>
        )
    });

    return (
        <ul className="settings-list">
            {listSettings}
        </ul>
    )
}

function SettingsView({ setViewToHome }) {
    return (
        <div className="menu-container">
            <h1>Game Settings</h1>

            {createSettings()}

            <Button className="menu-btn" onClick={setViewToHome}>Back to Main Menu</Button>
        </div>
    );
}

export { getDefaultSettings, SettingsView }
