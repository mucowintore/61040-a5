<script setup lang="ts">
import { usePostStore } from '@/stores/post';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { storeToRefs } from 'pinia';
import PostExplanation from './PostExplanation.vue';

const { setActiveSidebarComponent, SidebarComponent } = usePostStore()
const { explanations } = storeToRefs(usePostStore())

const onAddButtonClicked = () => {
    setActiveSidebarComponent(SidebarComponent.ADD_POST_EXPLANATION)
}
</script>

<template>
<main  class="container">
    <div v-for="explanation in explanations" :key="explanation._id">
        <PostExplanation :explanation_id="explanation._id" />
    </div>
    <div class="action_buttons">
        <button class="add_button" @click="onAddButtonClicked">
            <FontAwesomeIcon :icon="faPlus" :inverse="true" :size="'xl'"/>
        </button>
    </div>
        
        
</main>
</template>

<style scoped>
.container {
    height: 608px;
    width: 500px;
    position: relative;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
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
