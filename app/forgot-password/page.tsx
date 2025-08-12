"use client"

import { useState } from "react"

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("")
	const [status, setStatus] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [showSent, setShowSent] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setStatus("")
		setIsLoading(true)
		setShowSent(false)
		try {
			const response = await fetch("/api/auth/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email })
			})
			const result = await response.json()
			if (response.ok && result.success) {
				setShowSent(true)
				setStatus("If your email exists, you will receive a password reset link in your inbox within a few minutes.")
			} else {
				setShowSent(true)
				setStatus(result.message || "Could not send reset link. Please try again.")
			}
		} catch (err) {
			setShowSent(true)
			setStatus("An error occurred. Please try again.")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
			<div className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-10 border border-white/30">
				<div className="text-center mb-8">
					<div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
						<svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2 0v.217l8 5.066 8-5.066V6H4zm16 2.383l-7.445 4.71a2 2 0 01-2.11 0L4 8.383V18h16V8.383z"/></svg>
					</div>
					<h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Forgot Password?</h1>
					<p className="text-gray-600 text-sm">Enter your email to receive a password reset link.</p>
				</div>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
							required
							disabled={isLoading}
						/>
					</div>
					<button
						type="submit"
						disabled={isLoading || !email}
						className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
					>
						{isLoading ? (
							<div className="flex items-center justify-center">
								<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Sending...
							</div>
						) : (
							"Send Reset Link"
						)}
					</button>
				</form>
				{showSent && (
					<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-center text-sm animate-fade-in">
						<svg className="mx-auto mb-2" width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="#2563eb" d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 15l-5-5 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/></svg>
						{status}
					</div>
				)}
				<div className="mt-6 text-center text-xs text-gray-500">
					<a href="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">Back to Login</a>
				</div>
			</div>
		</div>
	)
}