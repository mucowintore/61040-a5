<script setup lang="ts">
import router from '@/router';
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import PostPreview from "./PostPreview.vue";

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);

async function getPosts() {
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { });
    console.log(JSON.stringify(postResults, null, 2))
  } catch (_) {
    return;
  }
  posts.value = postResults;
}

const postClicked = (postId: string) => {
  void router.push({ path: `/postDetails/${postId}`})
}

onBeforeMount(async () => {
  await getPosts();
  loaded.value = true;
});
</script>

<template>
  <div class="posts" v-if="loaded && posts.length !== 0">
    <div class="post" v-for="post in posts" :key="post._id">
      <PostPreview :post="post" @postClicked="postClicked"/>
    </div>
  </div>
  <p v-else>Loading...</p>
</template>

<style scoped>
.posts {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  align-items: start;
  gap: 20px;
}

.posts > .post {
    width: 20%;
    margin-bottom: 40px;
}

section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
