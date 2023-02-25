import type { ReactNode } from 'react'
import { SocketContext } from './'
import { useSocket } from '../../hooks/useSocket'

export type SocketState = {}

const SOCKET_INITIAL_STATE: SocketState = {}

type Props = {
	children: ReactNode
}

export const SocketProvider = ({ children }: Props) => {
	const { socket, online } = useSocket('http://localhost:3000')

	return (
		<SocketContext.Provider
			value={{
				online,
				socket,
			}}>
			{children}
		</SocketContext.Provider>
	)
}
