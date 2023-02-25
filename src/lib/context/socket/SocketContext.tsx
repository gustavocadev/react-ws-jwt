import { createContext, Dispatch, SetStateAction } from 'react'
import { Socket } from 'socket.io-client'

type ContextProps = {
	socket: Socket | null
	online: boolean
}

export const SocketContext = createContext({} as ContextProps)
