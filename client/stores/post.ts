import { defineStore } from "pinia"
import { ref } from 'vue'
import { fetchy } from "../utils/fetchy"

export const usePostStore = defineStore(
    "post",
    () => {
        const post = ref()
        const translations = ref()
        const recordings = ref()
        const transcriptions = ref()
        const explanations = ref()
        const upvotes = ref()
        const postAuthor = ref()
        
        enum SidebarComponent {
            POST_TRANSCRIPTIONS,
            POST_TRANSLATIONS,
            POST_EXPLANATIONS,
            POST_RECORDINGS,
            ADD_POST_TRANSCRIPTION,
            ADD_POST_TRANSLATION,
            ADD_POST_RECORDING,
            ADD_POST_EXPLANATION
        }
        const activeSidebarComponent = ref(SidebarComponent.POST_TRANSCRIPTIONS)
        
        

        const setPost = async (postId: string) => {
            try {
                post.value = await fetchy(`/api/posts/${postId}`, "GET")
                postAuthor.value = (await fetchy(`/api/users/userId/${post.value.author}`, 'GET')).username
                activeSidebarComponent.value = post.value.mediaType === 'text' ? SidebarComponent.POST_RECORDINGS : SidebarComponent.POST_TRANSCRIPTIONS
                await fetchRecordings(postId)
                await fetchTranslations(postId)
                await fetchTranscriptions(postId)
                await fetchExplanations(postId)
            } catch {
                return;
            }
        }

        // Transcription CRUD operations
        const fetchTranscriptions = async (postId: string) => {
            const result = []
            const rawTranscriptions = (await fetchy(`/api/posts/${postId}/transcriptions`, "GET")).transcriptions
            for(const t of rawTranscriptions) {
                const author = await fetchUsername(t.transcribedBy)
                const likes = await getUpvotes(t._id)
                result.push({
                    ...t,
                    transcribedBy: author,
                    likes
                })
            }

            transcriptions.value = result
        }

        const likeTranscription = async (transcriptionId: string) => {
            await fetchy(`/api/upvote/${transcriptionId}`, 'PUT')
            await fetchTranscriptions(post.value._id)
        }

        const unlikeTranscription = async (transcriptionId: string) => {
            await fetchy(`/api/upvote/${transcriptionId}`, 'DELETE')
            await fetchTranscriptions(post.value._id)
        }

        const deleteTranscription = async(transcriptionId: string) => {
            await fetchy(`/api/transcriptions/${transcriptionId}`, 'DELETE')
            await fetchTranscriptions(post.value._id)
        }

        const addTranscription = async(transcript: string) => {
            await fetchy(`/api/posts/${post.value._id}/transcription`, 'PUT', {
                body: { postId: post.value._id, transcript }
            })
            await fetchTranscriptions(post.value._id)
        }

        // Translation CRUD operations
        const fetchTranslations = async (postId: string) => {
            const result = []
            const rawTranslations = (await fetchy(`/api/posts/${postId}/translations`, "GET")).translations
            for(const t of rawTranslations) {
                const author = await fetchUsername(t.translatedBy)
                const likes = await getUpvotes(t._id)
                result.push({
                    ...t,
                    translatedBy: author,
                    likes
                })
            }

            translations.value = result
        }

        const likeTranslation = async (translationId: string) => {
            await fetchy(`/api/upvote/${translationId}`, 'PUT')
            await fetchTranslations(post.value._id)
        }

        const unlikeTranslation = async (translationId: string) => {
            await fetchy(`/api/upvote/${translationId}`, 'DELETE')
            await fetchTranslations(post.value._id)
        }

        const addTranslation = async(targetLanguage: string, translatedString: string) => {
            await fetchy(`/api/posts/${post.value._id}/translation`, 'PUT', {
                body: { postId: post.value._id, targetLanguage, translatedString }
            })
            await fetchTranslations(post.value._id)
        }

        const deleteTranslation = async(translationId: string) => {
            await fetchy(`/api/translations/${translationId}`, 'DELETE')
            await fetchTranslations(post.value._id)
        }

        // Explanation CRUD operations
        const fetchExplanations = async (postId: string) => {
            const result = []
            const rawExplanations = (await fetchy(`/api/posts/${postId}/explanations`, "GET")).explanations
            for(const t of rawExplanations) {
                const author = await fetchUsername(t.explainedBy)
                const likes = await getUpvotes(t._id)
                result.push({
                    ...t,
                    explainedBy: author,
                    likes
                })
            }

            explanations.value = result
        }
        
        const likeExplanation = async (explanationId: string) => {
            await fetchy(`/api/upvote/${explanationId}`, 'PUT')
            await fetchExplanations(post.value._id)
        }

        const unlikeExplanation = async (explanationId: string) => {
            await fetchy(`/api/upvote/${explanationId}`, 'DELETE')
            await fetchExplanations(post.value._id)
        }

        const addExplanation = async(entry: string, definition: string, example: string) => {
            await fetchy(`/api/posts/${post.value._id}/explanation`, 'PUT', {
                body: { postId: post.value._id, entry, definition, example }
            })
            await fetchExplanations(post.value._id)
        }

        const deleteExplanation = async(explanationId: string) => {
            await fetchy(`/api/explanations/${explanationId}`, 'DELETE')
            await fetchExplanations(post.value._id)
        }

        // Recording CRUD operations
        const fetchRecordings = async (postId: string) => {
            const result = []
            const rawRecordings = (await fetchy(`/api/posts/${postId}/recordings`, "GET")).recordings
            for(const t of rawRecordings) {
                const author = await fetchUsername(t.recordedBy)
                const likes = await getUpvotes(t._id)
                result.push({
                    ...t,
                    recordedBy: author,
                    likes
                })
            }

            recordings.value = result
        }

        const likeRecording = async (recordingId: string) => {
            await fetchy(`/api/upvote/${recordingId}`, 'PUT')
            await fetchExplanations(post.value._id)
        }

        const unlikeRecording = async (recordingId: string) => {
            await fetchy(`/api/upvote/${recordingId}`, 'DELETE')
            await fetchRecordings(post.value._id)
        }

        const addRecording = async(audioUrl: string) => {
            await fetchy(`/api/posts/${post.value._id}/recording`, 'PUT', {
                body: { postId: post.value._id, audioUrl }
            })
            await fetchRecordings(post.value._id)
        }

        const deleteRecording = async(recordingId: string) => {
            await fetchy(`/api/recordings/${recordingId}`, 'DELETE')
            await fetchRecordings(post.value._id)
        }

        const getUpvotes = async (contentId: string) => {
            const result = []
            const upvotes = (await fetchy(`/api/upvotes/${contentId}`, 'GET')).upvotes
            for(let u of upvotes) {
                result.push({
                    ...u,
                    user: await fetchUsername(u.user)
                })
            }

            return result
        }

        const fetchUsername = async (userId: string) => {
            const user = await fetchy(`/api/users/userId/${userId}`, 'GET')
            return user.username
        }

        const setActiveSidebarComponent = async (sidebarComponent: SidebarComponent) => {
            activeSidebarComponent.value = sidebarComponent
        }

        return {
            post,
            postAuthor,
            SidebarComponent,
            activeSidebarComponent,
            setActiveSidebarComponent,
            transcriptions,
            likeTranscription,
            unlikeTranscription,
            addTranscription,
            deleteTranscription,
            translations,
            likeTranslation,
            unlikeTranslation,
            addTranslation,
            deleteTranslation,
            explanations,
            likeExplanation,
            unlikeExplanation,
            addExplanation,
            deleteExplanation,
            recordings,
            likeRecording,
            unlikeRecording,
            addRecording,
            deleteRecording,
            upvotes,
            setPost
        }
    }
)