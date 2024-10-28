import { fetchy } from "../utils/fetchy"

export const fetchUsername = async (userId: string) => {
    const user = await fetchy(`/api/users/userId/${userId}`, 'GET')
    return user.username
} 

export const getUpvoteCount = async (contentId: string) => {
    const result = await fetchy(`/api/upvotes/${contentId}`, 'GET')
    return result.upvotes.length
}