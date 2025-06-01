import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
	const [form, setForm] = useState({ email: '', password: '' })
	const { login } = useAuth() // ✅ użyj login z kontekstu
	const navigate = useNavigate()

	const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

	const handleSubmit = async e => {
		e.preventDefault()
		const { data } = await axios.get(`http://localhost:5000/users?email=${form.email}`)
		const user = data[0]
		if (user && user.password === form.password) {
			login(user) // ✅ poprawna funkcja
			navigate('/') // ✅ przekieruj po zalogowaniu
		} else {
			alert('Nieprawidłowy email lub hasło')
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded shadow-md">
				<h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Logowanie</h2>

				<label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
				<input
					name="email"
					type="email"
					onChange={handleChange}
					placeholder="Wpisz email"
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
					Zaloguj się
				</button>

				<div className="mt-4 text-center">
					<p className="text-sm text-gray-600">
						Nie masz konta?{' '}
						<button type="button" onClick={() => navigate('/register')} className="text-blue-600 hover:underline">
							Zarejestruj się
						</button>
					</p>
				</div>
			</form>
		</div>
	)
}

export default Login
