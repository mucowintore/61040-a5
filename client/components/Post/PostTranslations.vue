<script setup lang="ts">
import { usePostStore } from '@/stores/post';
import { useUserStore } from '@/stores/user';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft, faChevronRight, faPlus, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const { likeTranslation, unlikeTranslation, deleteTranslation, setActiveSidebarComponent, SidebarComponent } = usePostStore()
const { translations } = storeToRefs(usePostStore())

const { currentUsername } = useUserStore()
const isLikeChangeInProgress = ref(false)

const currentIndex = ref(0)
const currentTranslation = computed(() => translations.value[currentIndex.value])
const prevButtonOpacity = computed(() => ({ opacity: currentIndex.value > 0 ? 1 : 0.4 }))
const nextButtonOpacity = computed(() => ({opacity: currentIndex.value < translations.value.length - 1 ? 1 : 0.4 }))
const hasLikedTranslation = computed(() => {
    const likers = translations.value[currentIndex.value].likes.map((l: { user: any; }) => l.user)
    return likers.includes(currentUsername)
})
const likeButtonColorStyle = computed(() => ({ backgroundColor: hasLikedTranslation.value ? '#198376' : '#f9f9f9'}))

const isTranslationAuthor = computed(() => {
    const result = currentTranslation.value.translatedBy === currentUsername
    return result
})

const hasMadeTranslation = computed(() => {
    const translators = translations.value.map((l: { translatedBy: any; }) => l.translatedBy)
    return translators.includes(currentUsername)
})

const onLikeButtonClicked = async () => {
    if(isLikeChangeInProgress.value)  return
    
    isLikeChangeInProgress.value = true
    if(hasLikedTranslation.value) {
        await unlikeTranslation(currentTranslation.value._id)
    } else {
        await likeTranslation(currentTranslation.value._id)
    }
    isLikeChangeInProgress.value = false
}

const onAddButtonClicked = () => {
    setActiveSidebarComponent(SidebarComponent.ADD_POST_TRANSLATION)
}

const onDeleteButtonClicked = async () => {
    const indexToDelete = currentIndex.value // Store index of translation to delete
    currentIndex.value = 0
    await deleteTranslation(translations.value[indexToDelete]._id)
}

const goToNextTranslation = () => {
    currentIndex.value = Math.min(currentIndex.value + 1, translations.value.length - 1)
}

const goToPreviousTranslation = () => {
    currentIndex.value = Math.max(currentIndex.value - 1 , 0)
}
</script>

<template>
<main  class="container">
    <div v-if="translations.length > 0" class="translations_container">
        <div class="translation_header">
            <button class="prev_translation_button" :style="prevButtonOpacity" @click="goToPreviousTranslation">
                <FontAwesomeIcon :icon="faChevronLeft"/>
            </button>
            <p class="translation_info">
                {{currentTranslation.translatedBy}}
                <span style="color: #009988; "><b>&nbsp;&nbsp;·&nbsp;&nbsp;</b></span>
                {{ currentTranslation.targetLanguage }}
                <span style="color: #009988; "><b>&nbsp;&nbsp;·&nbsp;&nbsp;</b></span>
                {{currentTranslation.likes.length}} likes</p>
            <button class="next_translation_button" :style="nextButtonOpacity" @click="goToNextTranslation">
                <FontAwesomeIcon :icon="faChevronRight"/>
            </button>
        </div>
        <div class="translation_content">
        <pre class="translated_text">{{ currentTranslation.translatedString }}</pre>
    </div>
    </div>
    <div class="action_buttons">
        <button class="like_button" :style="likeButtonColorStyle" @click="onLikeButtonClicked">
            <FontAwesomeIcon v-if="!isLikeChangeInProgress" :icon="faThumbsUp" :inverse="hasLikedTranslation" :size="'xl'"/>
            <FontAwesomeIcon v-else :icon="faSpinner" :inverse="hasLikedTranslation" spin :size="'xl'"/>
        </button>
        <button v-if="!isTranslationAuthor && !hasMadeTranslation" class="add_button" @click="onAddButtonClicked">
            <FontAwesomeIcon :icon="faPlus" :inverse="true" :size="'xl'"/>
        </button>
        <button v-else-if="isTranslationAuthor" class="delete_button" @click="onDeleteButtonClicked">
            <FontAwesomeIcon :icon="faTrash" :inverse="true" :size="'xl'"/>
        </button>
    </div>
        
        
</main>
</template>

<style scoped>
.translation_header {
    display: flex;
    align-items: center;
    height: 36px;
    margin-top: 28px;
    margin-left: 48px;
    margin-right: 48px;
    overflow: hidden;
    box-shadow: 0 0 2px rgba(0,0,0, 0.4);
    border-radius: 8px;
}

.container {
    height: 608px;
    width: 500px;
    position: relative;
    display: flex;
    flex-direction: column;
}

.no_translations_message {
    font-family: montserrat;
    font-weight: 500;
}

.translation_info {
    font-family: montserrat;
    flex: 1 1 auto;
    font-weight: 700;
    text-align: center;
    user-select: none;
    margin-top: 0px;
    margin-bottom: 0px;
}

.translation_content {
    flex: 1 1 auto;
    margin-top: 24px;
    height: 400px;
    overflow-y: auto;
}

.translated_text {
    white-space: pre-wrap;
    margin-top: 12px;
    padding-left: 30px;
    padding-right: 30px;
    font-family: montserrat;
    font-weight: 500;
    text-align: left;
}
.translations_container {
    display: flex;
    flex-direction: column;
    height: 608px;
    flex: 1 1 auto;
}
.prev_translation_button {
    display: flex;
    height: 36px;
    width: 36px;
    border: 0;
    background-color: white;
    justify-content: center;
    align-items: center;
}

.next_translation_button {
    display: flex;
    height: 36px;
    width: 36px;
    border: 0;
    background-color: white;
    justify-content: center;
    align-items: center;
}

.add_button {
    height: 56px;
    width: 56px;
    border-radius: 28px;
    margin-top: 8px;
    /* background-color: #009988; */
    background-color: #198376;
    opacity: 0.85;
    box-shadow: 0 0 2px #00000066;
    border: 0;
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
    position: absolute;
    bottom: 8px;
    right: 18px;
    float: right;
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
