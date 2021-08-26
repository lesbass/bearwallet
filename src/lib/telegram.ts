import userRepository from './repositories/userRepository'

export async function isUserAuthorized(userName: string) {
  const users = await userRepository.getTelegramUsers(false)
  return users.includes(userName)
}
