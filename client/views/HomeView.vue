<script setup lang="ts">
// import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import PostsComponent from "../components/Post/PostsComponent.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
    </section>
    <PostsComponent v-if="isLoggedIn"/>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
