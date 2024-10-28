<script setup lang="ts">
import { usePostStore } from '@/stores/post';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

import AddPostExplanation from './AddPostExplanation.vue';
import AddPostRecording from './AddPostRecording.vue';
import AddPostTranscription from './AddPostTranscription.vue';
import AddPostTranslation from './AddPostTranslation.vue';
import NoPostExplanations from './NoPostExplanations.vue';
import NoPostRecordings from './NoPostRecordings.vue';
import NoPostTranscriptions from './NoPostTranscriptions.vue';
import NoPostTranslations from './NoPostTranslations.vue';
import PostExplanations from './PostExplanations.vue';
import PostRecordings from './PostRecordings.vue';
import PostTranscriptions from './PostTranscriptions.vue';
import PostTranslations from './PostTranslations.vue';

const { activeSidebarComponent, post, recordings, transcriptions, translations, explanations } = storeToRefs(usePostStore())
const { SidebarComponent, setActiveSidebarComponent } = usePostStore()
const selectedTab = ref(0)

const getTabClass = (tabIndex: number) => {
    return selectedTab.value === tabIndex ? 'selected_tab' : 'unselected_tab'
}
const onTabSelected = async (tabIndex: number) => {
    switch(tabIndex) {
        case 0:
            if(post.value.mediaType === 'text') {
                await setActiveSidebarComponent(SidebarComponent.POST_RECORDINGS)    
            } else {
                await setActiveSidebarComponent(SidebarComponent.POST_TRANSCRIPTIONS)
            }
            break;
        case 1:
            await setActiveSidebarComponent(SidebarComponent.POST_TRANSLATIONS)
            break;
        case 2:
            await setActiveSidebarComponent(SidebarComponent.POST_EXPLANATIONS)
            break;
    }   
    selectedTab.value = tabIndex
}
</script>

<template>
    <main class='sidebar_container'>
        <div class='sidebar_tabs'>
            <button class="tab" :class="getTabClass(0)" @click="onTabSelected(0)">{{post.mediaType === 'text' ? 'Recordings' : 'Transcript'}}</button>
            <button class="tab" :class="getTabClass(1)" @click="onTabSelected(1)">Translations</button>
            <button class="tab" :class="getTabClass(2)" @click="onTabSelected(2)">Explanations</button>
        </div>
        <div class="sidebar_content">
            <PostTranscriptions v-if="activeSidebarComponent === SidebarComponent.POST_TRANSCRIPTIONS && transcriptions.length > 0" />
            <NoPostTranscriptions v-else-if="activeSidebarComponent === SidebarComponent.POST_TRANSCRIPTIONS && transcriptions.length === 0" />
            <AddPostTranscription v-else-if="activeSidebarComponent === SidebarComponent.ADD_POST_TRANSCRIPTION" />

            <PostRecordings v-if="activeSidebarComponent === SidebarComponent.POST_RECORDINGS && recordings.length > 0" />
            <NoPostRecordings v-else-if="activeSidebarComponent === SidebarComponent.POST_RECORDINGS && recordings.length === 0" />
            <AddPostRecording v-else-if="activeSidebarComponent === SidebarComponent.ADD_POST_RECORDING" />
            
            <PostTranslations v-if="activeSidebarComponent === SidebarComponent.POST_TRANSLATIONS && translations.length > 0" />
            <NoPostTranslations v-else-if="activeSidebarComponent === SidebarComponent.POST_TRANSLATIONS && translations.length === 0" />
            <AddPostTranslation v-else-if="activeSidebarComponent === SidebarComponent.ADD_POST_TRANSLATION" />
            
            <PostExplanations v-if="activeSidebarComponent === SidebarComponent.POST_EXPLANATIONS && explanations.length > 0" />
            <NoPostExplanations v-else-if="activeSidebarComponent === SidebarComponent.POST_EXPLANATIONS && explanations.length === 0" />
            <AddPostExplanation v-else-if="activeSidebarComponent === SidebarComponent.ADD_POST_EXPLANATION" />
        </div>
    </main>

</template>

<style scoped>
.sidebar_container {
    width: 500px;
    display: flex;
    flex-flow: column;
    margin-left: 16px;
    box-shadow: 0 0 2px rgba(0,0,0, 0.4);
    border-radius: 4px;
    overflow: hidden;
}

.tab {
    border: 0;
    flex-basis: 33.33%;
    flex-grow: 0;
    flex: 1 1 auto;
}
.unselected_tab {
    background-color: #e0ebea;
    font-weight: 600;
}

.unselected_tab:hover {
    background-color: #d1e1df;
}

.selected_tab {
    background-color: #198376;
    font-weight: 600;
    color: white;
}

.sidebar_tabs {
    display: flex;
    flex-direction: row;
    flex: 0 1 40px;
    box-shadow: 0 0 2px rgba(0,0,0, 0.4);
}

.sidebar_content {
    display: flex;
    flex: 1 1 auto;
}

button:hover {
    opacity: 1;
    cursor: pointer;
}
</style>
