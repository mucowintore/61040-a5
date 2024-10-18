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
      <h1 class="title">Create Post</h1>
      <form class="form_input" @submit.prevent="createPost(title, thumbnailUrl, mediaType, content)">
        <h3 class="input_header"><strong>Title</strong></h3>
        <textarea class="input_value" v-model="title" required></textarea>
        <h3 class="input_header"><strong>Content type</strong></h3>
        <select style="margin-bottom: 20px" v-model="mediaType">
          <option>text</option>
          <option>audio</option>
          <option>video</option>
        </select>
        <h3 class="input_header"><strong>Thumbnail URL</strong></h3>
        <textarea  class="input_value" v-model="thumbnailUrl" required></textarea>
        <div v-if="mediaType==='text'">
          <h3 class="input_header"><strong>Content text</strong></h3>
        <textarea  class="input_text_value" v-model="content" required></textarea>
        </div>
        <div v-else-if="mediaType==='audio'">
          <h3 class="input_header"><strong>Audio URL</strong></h3>
          <textarea  class="input_value" v-model="content" required></textarea>
        </div>
        <div v-else>
          <h3 class="input_header"><strong>Video URL</strong></h3>
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

.input_value {
  height: 24px;
  width: 400px;
  margin-bottom: 20px;
}
.container {
  background-color: aliceblue;
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
