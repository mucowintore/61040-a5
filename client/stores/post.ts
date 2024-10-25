import { defineStore } from "pinia"
import { ref } from 'vue'
import { fetchy } from "../utils/fetchy"

export const usePostStore = defineStore(
    "post",
    () => {
        const post = ref()
        const postTranslations = ref()
        const postRecordings = ref()
        const postTranscriptions = ref()
        const postExplanations = ref()
        const postUpvotes = ref()
        const postAuthor = ref()

        const setPost = async (postId: string) => {
            try {
                const fetchedPost = await fetchy(`/api/posts/${postId}`, "GET")
                console.log(`Post: ${JSON.stringify(fetchedPost, null, 2)}`)
                
                const fetchedTranslations = await fetchy(`/api/posts/${postId}/translations`, "GET")
                console.log(`Translations: ${JSON.stringify(fetchedTranslations, null, 2)}`)

                const fetchedPostAuthor = await fetchy(`/api/users/userId/${fetchedPost.author}`, 'GET')
                post.value = fetchedPost
                postTranslations.value = fetchedTranslations
                postAuthor.value = fetchedPostAuthor.username
            } catch {
                return;
            }
        }

        return {
            post,
            postAuthor,
            postTranslations,
            postRecordings,
            postTranscriptions,
            postExplanations,
            postUpvotes,
            setPost
        }
    }
)