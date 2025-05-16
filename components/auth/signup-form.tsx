"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "./auth-context"

interface SignupFormProps {
  onSuccess?: () => void
  onSwitchToLogin: () => void
}

/**
 * SignupForm component
 *
 * Provides a form for users to create a new account.
 * Uses the AuthContext to handle user registration.
 */
export default function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  // Form state
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get authentication methods from context
  const { signup } = useAuth()

  /**
   * Handle form submission
   * Attempts to register a new user with the provided information
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Attempt to sign up
      const result = await signup(username, email, password)

      if (result.success) {
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess()
        }
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-content">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <label htmlFor="username" className="block mb-1 font-medium">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="auth-input"
            placeholder="Choose a username"
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            placeholder="Enter your email"
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            placeholder="Create a password"
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block mb-1 font-medium">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="auth-input"
            placeholder="Confirm your password"
            disabled={isSubmitting}
            required
          />
        </div>

        <button type="submit" className="auth-button mt-6" disabled={isSubmitting}>
          {isSubmitting ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p>
          Already have an account?{" "}
          <span onClick={onSwitchToLogin} className="auth-link">
            Log in
          </span>
        </p>
      </div>
    </div>
  )
}
