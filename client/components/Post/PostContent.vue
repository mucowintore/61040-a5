<script setup lang="ts">
import { usePostStore } from '@/stores/post';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const { post, postAuthor, setPost } = usePostStore()
const loaded = ref(true)

// onBeforeMount(async () => {
//     console.log(`Route id: ${route.params.id}`)
//     const postId = (route.params.id) as string 
//     await setPost(postId)
//     loaded.value = true
// })

</script>

<template>
  <main>
    <div v-if="loaded">
        <div v-if="post.mediaType === 'text'" class="text_container">
            <pre class="post_text">{{ post.content }}</pre>
        </div>
        <div v-if="post.mediaType === 'video'" class="content_container">
            <video controls width = 1000px crossorigin="anonymous">
                <source :src="post.content">
            </video>
        </div>
        <div v-if="post.mediaType === 'audio'" class="audio_container">
            <audio controls width="1000px" class="audio_element" crossorigin="anonymous">
                <source :src="post.content">
            </audio>
        </div>
        <h2 class="postTitle">{{ post.title }}</h2>
        <p class="postAuthor">Posted by <b>{{  postAuthor }}</b></p>
    </div>
    <div v-else>
        <div class="text_container" style="display: flex; justify-content: center; align-items: center;">
            <pre class="post_text">Loading...</pre>
        </div>
    </div>
    
  </main>
</template>

<style scoped>
.post_text {
    font-family: montserrat;
    font-weight: 500;
    padding:32px;
    padding-right: 64px;
    white-space: pre-wrap;

}
.content_container {
    font-family: montserrat;
    border-radius: 4px;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    width: 1000px;
    box-shadow: 0 0 2px rgba(0,0,0, 0.4);
}

.text_container {
    font-family: montserrat;
    border-radius: 4px;
    aspect-ratio: 16 / 9;
    overflow-y: auto;
    width: 1000px;
    box-shadow: 0 0 2px rgba(0,0,0, 0.4);
}
.audio_container {
    font-family: montserrat;
    border-radius: 4px;
    aspect-ratio: 16 / 9;
    display: flex;
    flex-direction: column;
    justify-content: end;
    width: 1000px;
    box-shadow: 0 0 2px rgba(0,0,0, 0.4);
}

.postTitle {
    font-family: montserrat;
    margin-top: 16px;
    margin-bottom: 0px;
}

.postAuthor {
    font-family: montserrat;
    font-weight: 500;
    margin-top: 10px
}

.audio_element {
    width: 1000px;
    border-radius: 0
}

audio::-webkit-media-controls-enclosure {
    border-radius: 0;
}

</style>
