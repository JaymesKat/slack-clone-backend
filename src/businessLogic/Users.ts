import * as uuid from 'uuid'
import { User } from '../models/User'
import { UserDAO } from '../dataLayer/UserDAO'

const userDAO = new UserDAO()

export async function getAllUsers(): Promise<User[]> {
    return await userDAO.getUsers();
}

export async function getUser(userId: string): Promise<User> {
    return await userDAO.getUser(userId);
}

export async function getUserProfile(authId: string): Promise<User> {
    return await userDAO.getProfile(authId)
}

export async function createUserProfile(name: string, username: string, authId: string): Promise<User> {
    const newUser = {
        id: uuid.v4(),
        name,
        username,
        authId,
        status: 'active'
    }
    return await userDAO.createUserProfile(newUser)
}