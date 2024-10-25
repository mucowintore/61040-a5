<script setup lang="ts">
import PostContent from "@/components/Post/PostContent.vue";
import PostSidebar from "@/components/Post/PostSidebar.vue";

</script>

<template>
  <main>
    <div class="container">
        <PostContent/>
        <PostSidebar />
    </div>
  </main>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: row;
    margin: 32px
}

</style>
