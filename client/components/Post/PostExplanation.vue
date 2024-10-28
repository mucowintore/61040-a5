<script setup lang="ts">
import { usePostStore } from '@/stores/post';
import { useUserStore } from '@/stores/user';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const { currentUsername } = useUserStore()
const { likeExplanation, unlikeExplanation, deleteExplanation } = usePostStore()
const props = defineProps(['explanation_id'])

const { explanations } = storeToRefs(usePostStore())
const explanation = computed(() => explanations.value.find((e: { _id: any; }) => e._id === props.explanation_id))

const isLikeChangeInProgress = ref(false)
const hasLikedExplanation = computed(() => {
    const likers = explanation.value.likes.map((l: { user: any; }) => l.user)
    return likers.includes(currentUsername)
})
const likeButtonColorStyle = computed(() => ({ backgroundColor: hasLikedExplanation.value ? '#198376' : '#f9f9f9'}))

const isExplanationAuthor = computed(() => {
    const result = explanation.value.explainedBy === currentUsername
    console.log(`isTranscriptionAuthor: ${result}`)
    return result
})

const onLikeButtonClicked = async () => {
    if(isLikeChangeInProgress.value)  return
    
    isLikeChangeInProgress.value = true
    if(hasLikedExplanation.value) {
        await unlikeExplanation(explanation.value._id)
    } else {
        await likeExplanation(explanation.value._id)
    }
    isLikeChangeInProgress.value = false
}

const onDeleteButtonClicked = async () => {
    await deleteExplanation(explanation.value._id)
}
</script>

<template>
<main class="main_container">
    <div class="content">
        <div class="explanation_content">
            <p class="entry">{{explanation.entry}}</p>
            <p class="definition">{{explanation.definition}}</p>
            <p class="example">"{{explanation.example}}"</p>
        </div>
        <div class="explanation_footer">
            <p class="explanation_info">
                {{explanation.explainedBy}}
                <span style="color: #009988; "><b>&nbsp;&nbsp;·&nbsp;&nbsp;</b></span>
                {{explanation.likes.length}} likes</p>
        </div>
    </div>
    <div class="action_buttons">
        <button v-if="isExplanationAuthor" class="delete_button" @click="onDeleteButtonClicked">
            <FontAwesomeIcon :icon="faTrash" :inverse="true" :size="'xl'"/>
        </button>
        <button v-else class="like_button" :style="likeButtonColorStyle" @click="onLikeButtonClicked">
            <FontAwesomeIcon v-if="!isLikeChangeInProgress" :icon="faThumbsUp" :inverse="hasLikedExplanation" :size="'xl'"/>
            <FontAwesomeIcon v-else :icon="faSpinner" :inverse="hasLikedExplanation" spin :size="'xl'"/>
        </button>
    </div>
</main>
</template>

<style scoped>
.main_container {
    display: flex;
}
.content {
    height: 180px;
    margin-left: 24px;
    display: flex;
    flex-direction: column;
}
.entry {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;  
    overflow: hidden;
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 12px;
}
.definition {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;  
    overflow: hidden;
    font-weight: 500;
    margin: 0;
}
.example {
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;  
    overflow: hidden;
    margin-top: 8px;
    color: rgba(0, 0, 0, 0.6)
}

.definition {
    margin: 0;
}
.explanation_content {
    width: 400px;
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
    height: 180px;
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
