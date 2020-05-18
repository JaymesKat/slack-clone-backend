import { User } from './User'

export interface Message {
    messageId: string
    userId?: string
    channelId: string
    createdAt: string
    message: string
    user: Array<User>
    imageUrl?: string
}
  