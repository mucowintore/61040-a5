<script setup lang="ts">
import { usePostStore } from '@/stores/post';
import { useUserStore } from '@/stores/user';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const { currentUsername } = useUserStore()
const { likeRecording, unlikeRecording, deleteRecording } = usePostStore()
const props = defineProps(['recordingId'])

const { recordings } = storeToRefs(usePostStore())
const recording = computed(() => recordings.value.find((r: { _id: any; }) => r._id === props.recordingId))

const isLikeChangeInProgress = ref(false)
const hasLikedRecording = computed(() => {
    const likers = recording.value.likes.map((l: { user: any; }) => l.user)
    return likers.includes(currentUsername)
})
const likeButtonColorStyle = computed(() => ({ backgroundColor: hasLikedRecording.value ? '#198376' : '#f9f9f9'}))

const isRecordingAuthor = computed(() => {
    const result = recording.value.recordedBy === currentUsername
    return result
})

const onLikeButtonClicked = async () => {
    if(isLikeChangeInProgress.value)  return
    
    isLikeChangeInProgress.value = true
    if(hasLikedRecording.value) {
        await unlikeRecording(recording.value._id)
    } else {
        await likeRecording(recording.value._id)
    }
    isLikeChangeInProgress.value = false
}

const onDeleteButtonClicked = async () => {
    await deleteRecording(recording.value._id)
}
</script>

<template>
<main class="main_container">
    <div class="content">
        <div class="explanation_content">
            <audio controls class="audio_element" crossorigin="anonymous">
                <source :src="recording.audioUrl">
            </audio>
        </div>
        <div class="explanation_footer">
            <p class="explanation_info">
                {{recording.recordedBy}}
                <span style="color: #009988; "><b>&nbsp;&nbsp;·&nbsp;&nbsp;</b></span>
                {{recording.likes.length}} likes</p>
        </div>
    </div>
    <div class="action_buttons">
        <button v-if="isRecordingAuthor" class="delete_button" @click="onDeleteButtonClicked">
            <FontAwesomeIcon :icon="faTrash" :inverse="true" :size="'xl'"/>
        </button>
        <button v-else class="like_button" :style="likeButtonColorStyle" @click="onLikeButtonClicked">
            <FontAwesomeIcon v-if="!isLikeChangeInProgress" :icon="faThumbsUp" :inverse="hasLikedRecording" :size="'xl'"/>
            <FontAwesomeIcon v-else :icon="faSpinner" :inverse="hasLikedRecording" spin :size="'xl'"/>
        </button>
    </div>
</main>
</template>

<style scoped>
.main_container {
    display: flex;
}
.content {
    height: 140px;
    margin-left: 24px;
    display: flex;
    flex-direction: column;
}
.audio_element {
    width: 360px;
    border-radius: 0
}
.explanation_content {
    padding-top: 24px;
    width: 350px;
}
.explanation_info {
    font-family: montserrat;
    flex: 1 1 auto;
    font-weight: 600;
    text-align: center;
    user-select: none;
    margin-top: 0px;
    margin-bottom: 0px;
}
.explanation_footer {
    display: flex;
    align-items: center;
    height: 30px;
    width: 360px;
    margin-top: 8px;
    margin-right: 48px;
    overflow: hidden;
    box-shadow: 0 0 1px rgba(0,0,0, 0.4);
    border-radius: 8px;
}
.delete_button {
    height: 56px;
    width: 56px;
    border-radius: 28px;
    margin-top: 8px;
    background-color: #BD372D;
    opacity: 0.85;
    box-shadow: 0 0 2px #00000066;
    border: 0;
}

.like_button {
    height: 56px;
    width: 56px;
    border-radius: 28px;
    margin-top: 8px;
    /* background-color: #009988; */
    opacity: 0.85;
    box-shadow: 0 0 2px #00000066;
    border: 0;
}

.action_buttons {
    display: flex;
    justify-content: center;
    height: 140px;
    flex-direction: column;
}

.like_button:hover, .add_button:hover {
    opacity: 1;
    cursor: pointer;
}

.action_button:active {
    opacity: 0.7;
}

button:hover {
    cursor: pointer;
}

</style>
