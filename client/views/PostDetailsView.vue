<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useRoute } from 'vue-router';
import { fetchy } from "../utils/fetchy";

const route = useRoute()
let post: string
let username: string
const loaded = ref(false)

const getPost = async (postId: string) => {
    try {
        const result = await fetchy(`/api/posts/${postId}`, "GET")
        console.log(`Post: ${JSON.stringify(result, null, 2)}`)
        post = result
    } catch {
        return;
    }
}

onBeforeMount(async () => {
    console.log(`Route id: ${route.params.id}`)
    await getPost(route.params.id)
    loaded.value=true
})
</script>

<template>
  <main>
    <div v-if="loaded" style="margin-top: 32px; margin-left: 32px;">
        <!-- <p>{{ JSON.stringify(post, null, 2) }}</p> -->
        <div v-if="post.mediaType === 'text'" class="content_container" style="padding: 16px">
            <p>{{ post.content }}</p>
        </div>
        <div v-if="post.mediaType === 'video'" class="content_container">
            <video controls width = 800px crossorigin="anonymous">
                <source :src="post.content">
            </video>
        </div>
        <div v-if="post.mediaType === 'audio'" class="audio_container">
            <audio controls width="800px" class="audio_element" crossorigin="anonymous">
                <source :src="post.content">
            </audio>
        </div>
        <h2>{{ post.title }}</h2>
        <p><i>By {{  post.author }}</i></p>
    </div>
    
    <p v-else>Loading...</p>
  </main>
</template>

<style scoped>
.content_container {
    background-color: aliceblue;
    height: 450px;
    width: 800px
}

.audio_container {
    display: flex;
    background-color: aliceblue;
    align-items:end;
    height: 450px;
    width: 800px
}

.audio_element {
    width: 800px;
    border-radius: 0
}

audio::-webkit-media-controls-enclosure {
    border-radius: 0;
}

</style>
