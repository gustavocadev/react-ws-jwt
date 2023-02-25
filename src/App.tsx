import { useEffect, useState, useContext, FormEvent } from 'react'
import './App.css'
import { SocketContext } from './lib/context/socket/'

type Message = { id: string; fullName: string; message: string }

function App() {
	const [messages, setMessages] = useState<Message[]>([])
	const [clients, setClients] = useState([] as string[])
	const { online, socket } = useContext(SocketContext)

	useEffect(() => {
		socket?.on('clients-updated', (payload: string[]) => {
			console.log('socket connected')
			setClients(payload)
		})
	}, [socket])

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		const name = formData.get('name') as string

		socket?.emit('message-from-client', {
			message: name,
		})
		e.currentTarget.reset()
	}

	useEffect(() => {
		socket?.on('message-from-server', (payload: Message) => {
			// here we cant use the messages(state) state but we can use the callback function of the setMessages
			console.log('message-from-server', payload)
			setMessages((prev) => [payload, ...prev])
		})
	}, [socket])
	return (
		<main className="App">
			<h1>Socket.io Client</h1>

			<form
				onSubmit={(e) => {
					e.preventDefault()

					const token = new FormData(e.currentTarget).get('jwt') as string

					if (!token) return

					socket!.io.opts.extraHeaders = {
						token: token ?? '',
					}

					socket?.connect()
				}}
				className="flex flex-col gap-4">
				<label>JSON Web Token</label>
				<input type="text" name="jwt" className="text-white py-2 px-4 rounded" />
				<button type="submit" className="mb-4">
					Validar
				</button>
			</form>

			<p>Estado del socket: {online ? 'Online' : 'Offline'}</p>
			<h2>Personas conectas: {clients.length}</h2>
			<ul>
				{clients.map((client, index) => (
					<li key={index} className="text-3xl">
						id: {client}
					</li>
				))}
			</ul>
			<form method="get" onSubmit={handleSubmit} className="flex flex-col gap-4">
				<label htmlFor="">Ingrese el mensaje</label>
				<input type="text" name="name" id="name" className="text-white py-2 px-4 rounded" />
				<button type="submit">Enviar</button>
			</form>

			<h3>Messages</h3>
			<ul>
				{messages.map((msg, idx) => (
					<li key={crypto.randomUUID()} className="text-4xl">
						{msg.fullName}: {msg.message}
					</li>
				))}
			</ul>
		</main>
	)
}

export default App
