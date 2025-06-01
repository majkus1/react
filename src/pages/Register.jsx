import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {
	const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' })
	const navigate = useNavigate() // ✅ dodane

	const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

	const handleSubmit = async e => {
		e.preventDefault()
		await axios.post('http://localhost:5000/users', {
			...form,
			createdAt: new Date().toISOString(),
		})
		alert('Zarejestrowano! Przejdź do logowania')
		navigate('/login') // ✅ przekierowanie po rejestracji
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded shadow-md">
				<h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Rejestracja</h2>

				<label className="block text-gray-700 text-sm font-medium mb-1">Nazwa użytkownika</label>
				<input
					name="username"
					onChange={handleChange}
					placeholder="np. jan.kowalski"
					required
					className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
				/>

				<label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
				<input
					name="email"
					type="email"
					onChange={handleChange}
					placeholder="np. jan@test.com"
					required
					className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
				/>

				<label className="block text-gray-700 text-sm font-medium mb-1">Hasło</label>
				<input
					name="password"
					type="password"
					onChange={handleChange}
					placeholder="••••••••"
					required
					className="w-full mb-6 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
				/>

				<button
					type="submit"
					className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition">
					Zarejestruj się
				</button>
			</form>
		</div>
	)
}

export default Register
