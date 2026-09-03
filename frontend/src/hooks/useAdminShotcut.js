// src/hooks/useAdminShortcuts.js
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const SHORTCUTS = {
    "d": "/admin/dashboard",
    "u": "/admin/users",
    "s": "/admin/settings",
    "p": "/admin/products",
}

const useAdminShortcuts = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const handleKeyDown = (e) => {
            const tag = document.activeElement.tagName
            // input/textarea/select madhe typing karताना shortcut fire nako
            if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return

            const key = e.key.toLowerCase()
            if ((e.ctrlKey || e.metaKey) && SHORTCUTS[key]) {
                e.preventDefault()
                navigate(SHORTCUTS[key])
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [navigate])
}


export default useAdminShortcuts