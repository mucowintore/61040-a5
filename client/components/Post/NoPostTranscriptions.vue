<script setup lang="ts">
import { usePostStore } from '@/stores/post';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const { setActiveSidebarComponent, SidebarComponent } = usePostStore()

const onAddButtonClicked = () => {
    setActiveSidebarComponent(SidebarComponent.ADD_POST_TRANSCRIPTION)
}
</script>

<template>
<main class="container">
    <div class="content_container">
        <p class="no_translations_title">This post has no transcriptions</p>
        <p class="no_translations_message">Be the first to transcribe this post by clicking the green button below</p>
    </div>
    <div class="action_buttons">
        <button class="add_button" @click="onAddButtonClicked">
            <FontAwesomeIcon :icon="faPlus" :inverse="true" :size="'xl'"/>
        </button>
    </div>
        
        
</main>
</template>

<style scoped>
.no_translations_title {
    font-family: montserrat;
    font-weight: 700;
    font-size: 18px;
    margin: 0;
    color: #198376;
}
.no_translations_message {
    font-family: montserrat;
    font-weight: 500;
    margin-top: 12px;
    align-self: center;
    text-align: center;
}

.container {
    display: flex;
    position: relative;
    flex-direction: column;
    height: 608px;
    flex: 1 1 auto;
}

.content_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 608px;
    margin: 64px;
    justify-content: center;
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

.action_buttons {
    display: flex;
    position: absolute;
    bottom: 8px;
    right: 18px;
    float: right;
    flex-direction: column;
}

.add_button:hover {
    opacity: 1;
    cursor: pointer;
}
</style>
