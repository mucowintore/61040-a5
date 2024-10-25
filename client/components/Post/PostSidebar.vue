<script setup lang="ts">
import PostTranscripts from './PostTranscripts.vue';


</script>

<template>
    <main class='sidebar_container'>
        <div class='sidebar_tabs'>

        </div>
        <div class="sidebar_content">
            <PostTranscripts />
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
}

.sidebar_tabs {
    flex: 0 1 40px;
    background-color: aliceblue;
}

.sidebar_content {
    display: flex;
    flex: 1 1 auto;
    /* background-color: antiquewhite; */
}
</style>
