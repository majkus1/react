import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import CalendarView from '../components/CalendarView'

const Dashboard = () => {
	const { user, logout } = useAuth()
	const navigate = useNavigate()
	const [allUsers, setAllUsers] = useState([])
	const [editingMeeting, setEditingMeeting] = useState(null)
	const [filters, setFilters] = useState({ date: '', participant: '', status: '' })
	const [sortBy, setSortBy] = useState('startTime')

	if (!user) {
		navigate('/login')
		return null
	}

	const handleEditChange = e => {
		const { name, value } = e.target
		setEditingMeeting(prev => ({
			...prev,
			[name]: name === 'participants' ? value.split(',').map(p => p.trim()) : value,
		}))
	}

	const handleUpdate = async e => {
		e.preventDefault()
		await axios.put(`http://localhost:5000/meetings/${editingMeeting.id}`, editingMeeting)
		const updated = meetings.map(m => (m.id === editingMeeting.id ? editingMeeting : m))
		setMeetings(updated)
		setEditingMeeting(null)
	}

	const [meetings, setMeetings] = useState([])
	const [form, setForm] = useState({
		title: '',
		description: '',
		date: '',
		startTime: '',
		endTime: '',
		participants: '',
	})

	const handleDeleteUser = async id => {
		if (confirm('Na pewno chcesz usunąć tego użytkownika?')) {
			await axios.delete(`http://localhost:5000/users/${id}`)
			setAllUsers(allUsers.filter(u => u.id !== id))
		}
	}

	useEffect(() => {
		const fetchMeetings = async () => {
			const { data } = await axios.get('http://localhost:5000/meetings')
			const filtered =
				user.role === 'admin'
					? data
					: data.filter(m => m.createdBy === user.email || (m.participants || []).includes(user.email))
			setMeetings(filtered)

			if (user.role === 'admin') {
				const fetchUsers = async () => {
					const { data } = await axios.get('http://localhost:5000/users')
					setAllUsers(data)
				}
				fetchUsers()
			}
		}

		fetchMeetings()
	}, [user])

	const handleChange = e => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const handleCreate = async e => {
		e.preventDefault()

		const newMeeting = {
			...form,
			participants: form.participants.split(',').map(p => p.trim()),
			createdBy: user.email,
			status: 'Zaplanowane',
			createdAt: new Date().toISOString(),
		}

		await axios.post('http://localhost:5000/meetings', newMeeting)
		setMeetings([...meetings, newMeeting])
		setForm({ title: '', description: '', date: '', startTime: '', endTime: '', participants: '' })
	}

	const handleCancelMeeting = async id => {
		try {
			const meeting = meetings.find(m => m.id === id)
			const updatedMeeting = { ...meeting, status: 'Odwołane' }
			await axios.put(`http://localhost:5000/meetings/${id}`, updatedMeeting)
			setMeetings(meetings.map(m => (m.id === id ? updatedMeeting : m)))
		} catch (err) {
			console.error('Błąd anulowania spotkania:', err)
			alert('Nie udało się odwołać spotkania.')
		}
	}

	return (
		<div className="max-w-6xl mx-auto px-4 py-6">
			<div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-2">
				<h1 className="text-3xl font-bold text-blue-800">
					Witaj, {user.username} <span className="text-sm text-gray-500">({user.role})</span>
				</h1>
				<button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow">
					Wyloguj
				</button>
			</div>

			<form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
				<h2 className="col-span-1 md:col-span-2 text-lg font-semibold text-gray-700">Nowa rezerwacja</h2>
				<input name="title" placeholder="Tytuł" value={form.title} onChange={handleChange} required className="input" />
				<input
					name="description"
					placeholder="Opis"
					value={form.description}
					onChange={handleChange}
					className="input"
				/>
				<input name="date" type="date" value={form.date} onChange={handleChange} required className="input" />
				<input name="startTime" type="time" value={form.startTime} onChange={handleChange} required className="input" />
				<input name="endTime" type="time" value={form.endTime} onChange={handleChange} required className="input" />
				<input
					name="participants"
					placeholder="Uczestnicy (email1,email2,...)"
					value={form.participants}
					onChange={handleChange}
					className="input md:col-span-2"
				/>
				<button
					type="submit"
					className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded col-span-1 md:col-span-2">
					Dodaj Rezerwację
				</button>
			</form>

			{editingMeeting && (
				<form onSubmit={handleUpdate} className="grid grid-cols-2 gap-2 mb-6 border-t pt-4 mt-6">
					<h3 className="col-span-2 text-lg font-bold">Edycja spotkania</h3>
					<input
						name="title"
						value={editingMeeting.title}
						onChange={handleEditChange}
						placeholder="Tytuł"
						className="p-2 border"
					/>
					<input
						name="description"
						value={editingMeeting.description}
						onChange={handleEditChange}
						placeholder="Opis"
						className="p-2 border"
					/>
					<input
						name="date"
						type="date"
						value={editingMeeting.date}
						onChange={handleEditChange}
						className="p-2 border"
					/>
					<input
						name="startTime"
						type="time"
						value={editingMeeting.startTime}
						onChange={handleEditChange}
						className="p-2 border"
					/>
					<input
						name="endTime"
						type="time"
						value={editingMeeting.endTime}
						onChange={handleEditChange}
						className="p-2 border"
					/>
					<input
						name="participants"
						value={editingMeeting.participants.join(', ')}
						onChange={handleEditChange}
						placeholder="Uczestnicy"
						className="col-span-2 p-2 border"
					/>
					<button type="submit" className="col-span-1 bg-green-600 text-white py-2 rounded">
						Zapisz zmiany
					</button>
					<button
						type="button"
						onClick={() => setEditingMeeting(null)}
						className="col-span-1 bg-gray-400 text-white py-2 rounded">
						Anuluj
					</button>
				</form>
			)}

			<h2 className="text-xl font-bold mb-4">Twoje rezerwacje</h2>

			<div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
				<input
					type="date"
					value={filters.date}
					onChange={e => setFilters({ ...filters, date: e.target.value })}
					className="p-2 border"
					placeholder="Filtruj po dacie"
				/>
				<input
					type="text"
					value={filters.participant}
					onChange={e => setFilters({ ...filters, participant: e.target.value })}
					className="p-2 border"
					placeholder="Email uczestnika"
				/>
				<select
					value={filters.status}
					onChange={e => setFilters({ ...filters, status: e.target.value })}
					className="p-2 border">
					<option value="">Wszystkie statusy</option>
					<option value="Zaplanowane">Zaplanowane</option>
					<option value="Odwołane">Odwołane</option>
				</select>
				<select value={sortBy} onChange={e => setSortBy(e.target.value)} className="p-2 border">
					<option value="startTime">Sortuj po godzinie</option>
					<option value="createdAt">Sortuj po dacie utworzenia</option>
				</select>
			</div>

			<ul>
				{meetings
					.filter(m => {
						const dateMatch = filters.date ? m.date === filters.date : true
						const participantMatch = filters.participant ? m.participants?.includes(filters.participant) : true
						const statusMatch = filters.status ? m.status === filters.status : true
						return dateMatch && participantMatch && statusMatch
					})
					.sort((a, b) => {
						if (sortBy === 'startTime') {
							return a.startTime.localeCompare(b.startTime)
						} else if (sortBy === 'createdAt') {
							return new Date(a.createdAt) - new Date(b.createdAt)
						}
						return 0
					})
					.map(m => (
						<li
							key={m.id}
							className={`p-4 border rounded shadow-sm ${
								m.status === 'Odwołane' ? 'bg-gray-100 text-gray-500' : 'bg-white'
							}`}>
							<div className="flex flex-col md:flex-row md:justify-between md:items-center">
								<div>
									<h3 className="text-lg font-semibold">{m.title}</h3>
									<p className="text-sm">
										{m.date} | {m.startTime}–{m.endTime} | <span className="italic">{m.status}</span>
									</p>
									<p className="text-xs text-gray-500">Utworzone przez: {m.createdBy}</p>
								</div>
								{(user.role === 'admin' || m.createdBy === user.email) && (
									<div className="mt-2 md:mt-0 flex gap-2">
										{m.status !== 'Odwołane' && (
											<button onClick={() => handleCancelMeeting(m.id)} className="btn-red">
												Odwołaj
											</button>
										)}
										<button onClick={() => setEditingMeeting(m)} className="btn-yellow">
											Edytuj
										</button>
									</div>
								)}
							</div>
						</li>
					))}
			</ul>

			<CalendarView meetings={meetings} />

			{user.role === 'admin' && (
				<div className="mt-12">
					<h2 className="text-xl font-bold mb-4">Wszyscy użytkownicy</h2>
					<ul className="space-y-3">
						{allUsers.map(u => (
							<li key={u.id} className="bg-white p-4 border rounded shadow-sm flex justify-between items-center">
								<div>
									<p className="font-medium">{u.username}</p>
									<p className="text-sm text-gray-600">
										{u.email} ({u.role})
									</p>
								</div>
								<button onClick={() => handleDeleteUser(u.id)} className="btn-red">
									Usuń
								</button>
							</li>
						))}
					</ul>
				</div>
			)}

		</div>
	)
}

export default Dashboard
