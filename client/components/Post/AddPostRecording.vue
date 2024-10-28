<script setup lang="ts">
import { usePostStore } from '@/stores/post';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';

const { setActiveSidebarComponent, SidebarComponent, addRecording } = usePostStore()
const inputAudioUrl = ref('')
const isInputAudioUrlValid = ref(true)

const onCloseButtonClicked = () => {
    setActiveSidebarComponent(SidebarComponent.POST_RECORDINGS)
}

const inputAudioUrlBorderColor = computed(() => ({ borderColor: isInputAudioUrlValid.value ? '#006B5E' : '#9E0000' }))

const onSubmitButtonClicked = async () => {
    if(inputAudioUrl.value === '') {
        isInputAudioUrlValid.value = false
    } else {
        await addRecording(inputAudioUrl.value)
        setActiveSidebarComponent(SidebarComponent.POST_RECORDINGS)
    }
}
</script>

<template>
<main>
    <div class="add_container">
        <div class="header_section">
            <p class="header_title">Add a recording</p>
            <button class="close_button" @click="onCloseButtonClicked">
                    <FontAwesomeIcon :icon="faXmark" :size="'lg'"/>
            </button>
        </div>
        <div class="content_section">
            <p class="instructions">Bring this post’s text to life by contributing an audio recording of its content!</p>
            <p class="recording_input_label">Audio URL</p>
            <textarea class="recording_input" :style="inputAudioUrlBorderColor" v-model="inputAudioUrl" />
            <p class="recording_input_error" v-if="!isInputAudioUrlValid">Please add a recording</p>
            <button class="submit_button" @click="onSubmitButtonClicked">
            Submit
        </button>
        </div>
    </div>
</main>
</template>

<style scoped>
.add_container {
    display: flex;
    flex-direction: column;
    height: 608px;
    width: 500px;
    flex: 1 1 auto;
}

.header_section {
    display: flex;
    margin-top: 16px;
    flex-direction: row;
    align-items: center;
}

.content_section {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
}

.header_title {
    font-family: montserrat;
    font-weight: 700;
    color: #006B5E;
    font-size: 20px;
    margin: 0;
    margin-left: 24px;
    /* padding-top: 12px; */
    padding: 0;
    flex: 1 1 auto;
}

.instructions {
    font-family: montserrat;
    font-weight: 500;
    padding-left: 24px;
    padding-right: 32px;
}
.recording_input_label {
    font-family: montserrat;
    color: #006B5E;
    font-weight: 700;
    margin-left: 24px;
    margin-bottom: 8px;
}

.recording_input {
    height: 18px;
    padding: 8px;
    border-width: 1px;
    border-color: #006B5E;
    resize: none;
    border-radius: 2px;
    line-height: 15px;
    margin-left: 24px;
    margin-right: 32px;
    font-weight: 500;
}
.recording_input_error {
    margin: 0;
    margin-left: 24px;
    margin-top: 4px;
    font-size: 14px;
    color: #9E0000;
}

.close_button {
    display: flex;
    height: 36px;
    width: 36px;
    padding-right: 32px;
    opacity: 0.7;
    border: 0;
    background-color: white;
    justify-content: center;
    align-items: center;
}

.submit_button {
    height: 36px;
    width: 180px;
    color: white;
    font-weight: 700;   
    margin-top: 24px;
    background-color: #198376;
    opacity: 0.85;
    align-self: center;
    border-radius: 28px;
    border: 0;
    box-shadow: 0 0 2px #00000066;
}

button:hover {
    cursor: pointer;
    opacity: 1;
}

button:active {
    opacity: 0.7;
}


</style>
