<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const props = defineProps(["post"]);
const emit = defineEmits(["postClicked"])

console.log(`Props: ${JSON.stringify(props, null, 2)}`)
const { currentUsername } = storeToRefs(useUserStore());

</script>

<template>
    <div class="container" @click="emit('postClicked', props.post._id)">
        <img class="post_thumbnail" width="300" height="200" :src="props.post.thumbnailUrl">
        <div class="post_details">
        <h3 class="post_title">{{ props.post.title }}</h3>
        <p><i>By {{  props.post.author }}</i></p>
        </div>
    </div>
    
  </template>
  
  <style scoped>
  p {
    margin: 0em;
  }

  .container {
    display: flex;
    flex-direction: column;
    flex-basis: auto
  }
  .post_thumbnail {
    width: 300;
    height: 200;
    margin: 0;
  }
  
  .author {
    font-weight: bold;
    font-size: 1.2em;
  }

  .post_title {
    display: flex;
    flex-basis: auto;
    padding: 0;
    margin: 0
  }

  .post_details {
    display: flex;
    flex-basis: auto;
    flex-direction: column;
    margin:0
  }
  </style>