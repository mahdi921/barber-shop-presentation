import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem("site-theme") || "default";
        } catch {
            return "default";
        }
    });

    useEffect(() => {
        const el = document.documentElement;
        el.setAttribute("data-theme", theme);
        try {
            localStorage.setItem("site-theme", theme);
        } catch { }
        // announce change for screen readers
        const live = document.getElementById("theme-announcer");
        if (live) {
            live.textContent = theme === "women" ? "نسخه بانوان فعال شد" : "نسخه عمومی فعال شد";
        }
    }, [theme]);

    const toggleToWomen = () => setTheme("women");
    const toggleToDefault = () => setTheme("default");

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleToWomen, toggleToDefault }}>
            <div id="theme-announcer" aria-live="polite" style={{ position: "absolute", left: -9999, top: "auto", width: 1, height: 1, overflow: "hidden" }} />
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return ctx;
}
