import { useState } from 'react';
import Button from "../ui/Button";
import { useTranslation } from "react-i18next";



export default function LanguageDropdown() {


    const { t, i18n } = useTranslation();

    const [open, setOpen] = useState(false);
    const languages = [
        { code: "en", label: "English" },
        { code: "fi", label: "Suomi" },
        { code: "vi", label: "Vietnamese" },
        { code: "ne", label: "नेपाली" },
    ];

    return (
        <div className="fixed top-4 right-4 z-50">
            <Button
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-100 w-40"
                onClick={() => setOpen(!open)}
            >
                🌐 Language ▾
            </Button>
            {open && (
                <div className="absolute right-0 mt-1 w-40 rounded-md border border-purple-200 bg-white shadow-lg z-50">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className="w-full px-4 py-2 text-left text-purple-700 hover:bg-purple-50 text-sm"
                            onClick={() => {
                                i18n.changeLanguage(lang.code);
                                setOpen(false);
                            }}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>


    )
}