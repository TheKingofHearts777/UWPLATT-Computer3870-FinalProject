import { useState } from "react";
import { Button, Form } from "react-bootstrap";

const settingsSchema = {
    difficulty: {
        label: "Difficulty",
        type: "dropdown",
        values: { easy: "Easy", medium: "Medium", hard: "Hard" },
        default: "easy"
    },

    sound: {
        label: "Sound",
        type: "dropdown",
        values: { on: "On", off: "Off" },
        default: "off"
    },

    cpu_count: {
        label: "CPU Count",
        type: "slider",
        min: 1,
        max: 3,
        default: 1,
    }
};

function getDefaultSettings() {
    let defaultSettings = {};

    for (let settingKey of Object.keys(settingsSchema)) {
        defaultSettings[settingKey] = settingsSchema[settingKey].default;
    }

    return defaultSettings;
}

function SettingsView({ setViewToHome, settings, setSettings }) {
    function updateSetting(key, value) {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    }

    function createDropdown(setting, settingKey) {
        return (
            <div className="align-items-center gap-3 mb-3">
                <Form.Label htmlFor={settingKey} style={{ margin: 0 }}>
                    {setting.label}: {setting.values[settings[settingKey]]}
                </Form.Label>

                <Form.Select
                    id={settingKey}
                    name={settingKey}
                    value={settings[settingKey]}
                    onChange={(e) => updateSetting(settingKey, e.target.value)}
                >
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

    function createSlider(setting, settingKey) {
        return (
            <div className="align-items-center gap-3 mb-3">
                <Form.Label htmlFor={settingKey} style={{ margin: 0 }}>
                    {setting.label}: {settings[settingKey]}
                </Form.Label>

                <Form.Range
                    id={settingKey}
                    name={settingKey}
                    min={setting.min}
                    max={setting.max}
                    value={settings[settingKey]}
                    step={1}
                    onChange={(e) => updateSetting(settingKey, Number(e.target.value))}>
                </Form.Range>
            </div>
        );
    }

    const listSettings = Object.keys(settingsSchema).map((settingKey) => {
        const setting = settingsSchema[settingKey];

        return (
            <li key={settingKey} className="settings-item">
                {setting.type == "dropdown" && createDropdown(setting, settingKey)}
                {setting.type == "slider" && createSlider(setting, settingKey)}
            </li>
        )
    });

    return (
        <div className="menu-container">
            <h1>Game Settings</h1>

            <ul className="settings-list">
                {listSettings}
            </ul>

            <Button className="menu-btn" onClick={setViewToHome}>Back to Main Menu</Button>
        </div>
    );
}

export { getDefaultSettings, SettingsView }
