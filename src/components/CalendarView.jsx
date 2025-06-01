import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const CalendarView = ({ meetings }) => {
	const [date, setDate] = useState(new Date())

	const getDateOnly = str => new Date(str).toLocaleDateString('pl-PL')
	const selectedDate = date.toLocaleDateString('pl-PL')

	const meetingsOnDay = meetings.filter(m => getDateOnly(m.date) === selectedDate)

	return (
		<div className="my-6">
			<Calendar onChange={setDate} value={date} />
			<h3 className="mt-4 font-bold">Spotkania na {date.toLocaleDateString()}:</h3>
			<ul>
				{meetingsOnDay.map(m => (
					<li key={m.id}>
						{m.title} – {m.startTime}-{m.endTime}
					</li>
				))}
				{meetingsOnDay.length === 0 && <p>Brak spotkań tego dnia.</p>}
			</ul>
		</div>
	)
}

export default CalendarView
