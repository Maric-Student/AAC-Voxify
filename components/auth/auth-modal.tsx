"use client"

import { useState } from "react"
import { X } from "lucide-react"
import LoginForm from "./login-form"
import SignupForm from "./signup-form"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialView?: "login" | "signup"
}

/**
 * AuthModal component
 *
 * Modal dialog that contains login and signup forms.
 * Allows users to switch between login and signup views.
 */
export default function AuthModal({ isOpen, onClose, initialView = "login" }: AuthModalProps) {
  // Track which form to display
  const [view, setView] = useState<"login" | "signup">(initialView)

  // If modal is not open, don't render anything
  if (!isOpen) return null

  return (
    <div className="auth-container" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <div className="auth-header">
          <h2 className="text-xl font-bold">{view === "login" ? "Log In" : "Sign Up"}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {view === "login" ? (
          <LoginForm onSuccess={onClose} onSwitchToSignup={() => setView("signup")} />
        ) : (
          <SignupForm onSuccess={onClose} onSwitchToLogin={() => setView("login")} />
        )}
      </div>
    </div>
  )
}
