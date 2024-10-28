<script setup lang="ts">
import router from '@/router';
import { ref } from "vue";
import { fetchy } from "../utils/fetchy";

const title = ref("")
const content = ref("")
const mediaType = ref("text")
const thumbnailUrl = ref("")

const createPost = async (title: string, thumbnailUrl: string, mediaType: string, content: string) => {
  try {
    await fetchy("/api/posts", "POST", {
      body: {
        title,
        thumbnailUrl,
        mediaType,
        content
      }
    })
    void router.push({ name: 'Home' })

  } catch (_) {
    return; 
  }
  
}
</script>

<template>
  <main>
    <div class="container">
      <p class="title">Create Post</p>
      <p class="description">Add your contribution to Akaranga by posting a new text, audio or video using the form below.</p>
      <form class="form_input" @submit.prevent="createPost(title, thumbnailUrl, mediaType, content)">
        <h3 class="input_header">Title</h3>
        <textarea class="input_value" v-model="title" required></textarea>
        <h3 class="input_header">Content type</h3>
        <select style="margin-bottom: 20px" v-model="mediaType">
          <option>text</option>
          <option>audio</option>
          <option>video</option>
        </select>
        <h3 class="input_header">Thumbnail URL</h3>
        <textarea  class="input_value" v-model="thumbnailUrl" required></textarea>
        <div v-if="mediaType==='text'">
          <h3 class="input_header">Content text</h3>
        <textarea  class="input_text_value" v-model="content" required></textarea>
        </div>
        <div v-else-if="mediaType==='audio'">
          <h3 class="input_header">Audio URL</h3>
          <textarea  class="input_value" v-model="content" required></textarea>
        </div>
        <div v-else>
          <h3 class="input_header">Video URL</h3>
        <textarea  class="input_value" v-model="content" required></textarea>
        </div>
        <button type="submit">Post</button>
      </form>
    </div>
  </main>
</template>

<style scoped>
.input_header {
 font-size: 18px;
 margin:0
}

.input_text_value {
  height: 300px;
  width: 400px;
  margin-bottom: 20px;
}
.title {
  font-family: montserrat;
  font-size: 30px;
  font-weight: 700;
  color: #006B5E;
  margin-bottom: 8px;
}
.description {
  font-weight: 500;
  margin-bottom: 48px;
}
.input_value {
  height: 24px;
  width: 400px;
  margin-bottom: 20px;
}
.container {
  display: flex;
  flex-direction: column;
  margin-top: 64px;
  margin-left: 64px;
}

.post_content {
  background-color: antiquewhite;
  flex: 1 1 60%
}

.post_sidebar {
  background-color: aliceblue;
  flex: 1 1 40%
}

</style>
