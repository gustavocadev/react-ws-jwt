import { io, Manager, Socket } from 'socket.io-client'

import { useState, useEffect, useMemo } from 'react'

export const useSocket = (serverPath: string) => {
	const manager = useMemo(() => {
		return new Manager(serverPath, {
			autoConnect: false,
		})
	}, [serverPath])

	const socket = useMemo(() => {
		return manager.socket('/')
	}, [manager])

	const [online, setOnline] = useState<boolean>(false)

	useEffect(() => {
		setOnline(socket.connected ?? false)
	}, [])

	useEffect(() => {
		socket.on('connect', () => {
			setOnline(true)
		})
	}, [])

	useEffect(() => {
		socket.on('disconnect', () => {
			setOnline(false)
		})
	}, [])

	return {
		socket,
		online,
	}
}
