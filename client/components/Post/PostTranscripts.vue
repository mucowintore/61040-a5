<script setup lang="ts">
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft, faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const onLeftClicked = () => {
    console.log(`Left clicked!`)
}

const onRightClicked = () => {
    console.log(`Right clicked!`)
}
</script>

<template>
<main class="transcripts_container">
    <div class="transcript_header">
        <div class="nav_button" @click="onLeftClicked">
            <FontAwesomeIcon :icon="faChevronLeft"/>
        </div>
        <p class="transcript_info">muco2 <span style="color: #009988"><b>  ·  </b></span> 256 likes</p>
        <div class="nav_button" @click="onRightClicked">
            <FontAwesomeIcon :icon="faChevronRight"/>
        </div>
    </div>
    <div class="transcript_content">
        <pre class="transcript_text">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras bibendum elementum odio, sed placerat sapien tincidunt quis. Aliquam ipsum lectus, porttitor venenatis ipsum quis, viverra aliquet ligula. Etiam feugiat eget orci a pharetra. Mauris at lacinia ex, in eleifend arcu. Phasellus ornare orci quis blandit dignissim. Proin et orci eget lorem volutpat pretium. Fusce rutrum augue mi, sed hendrerit justo accumsan molestie. Curabitur luctus dolor vel justo lobortis commodo. Duis malesuada lorem a porttitor cursus. Vivamus molestie quis leo quis consectetur. Pellentesque quis massa ex. Quisque efficitur, ipsum ut viverra ultricies, augue tellus lobortis tortor, et finibus mauris augue in enim. Phasellus accumsan risus urna, ut hendrerit nibh pretium vel. Mauris sem dolor, facilisis ac fermentum eget, auctor in sapien. Nam mattis turpis purus, id tincidunt tortor dictum in. Nunc ut lorem luctus, sagittis mauris id, aliquet nunc.

Curabitur sodales dolor ut augue commodo dignissim. Aenean rhoncus metus urna, in ultrices enim posuere nec. Fusce non felis et elit condimentum dapibus. Pellentesque laoreet libero sed egestas tincidunt. Ut in magna ligula. Aliquam vel nibh erat. Etiam vel placerat ligula, sit amet facilisis turpis. Nullam vulputate ante et magna feugiat, eget lobortis nisi convallis. Phasellus egestas est vitae tellus porta eleifend.

Phasellus rhoncus nec mauris ut varius. Ut venenatis, libero eget hendrerit facilisis, lacus ipsum viverra arcu, ac iaculis libero libero vel arcu. In auctor vulputate mauris vel rhoncus. Duis a sapien augue. Curabitur condimentum urna id bibendum mattis. Donec pretium sagittis diam, sit amet ultrices odio. Phasellus luctus aliquam odio, ut consequat erat tempor eget. Nunc vel sagittis lacus, ut vestibulum orci. Praesent in ullamcorper urna, ac congue sem. Praesent hendrerit elit ut urna ornare, ut blandit odio venenatis.
    </pre>
    </div>
    <div class="action_buttons">
        <button class="action_button">
            <FontAwesomeIcon :icon="faThumbsUp" :inverse="true" :size="'xl'"/>
        </button>
        <button class="action_button">
            <FontAwesomeIcon :icon="faPlus" :inverse="true" :size="'xl'"/>
        </button>
    </div>
        
        
</main>
</template>

<style scoped>
.transcript_header {
    display: flex;
    align-items: center;
    height: 36px;
    margin-top: 16px;
    margin-left: 48px;
    margin-right: 48px;
    box-shadow: 0 0 2px rgba(0,0,0, 0.4);
    border-radius: 8px;
}
.transcript_info {
    font-family: montserrat;
    flex: 1 1 auto;
    font-weight: 700;
    text-align: center;
    user-select: none;
    margin-top: 0px;
    margin-bottom: 0px;
}

.transcript_content {
    flex: 1 1 auto;
    margin-top: 24px;
    height: 400px;
    overflow-y: scroll;
}

.transcript_text {
    white-space: pre-wrap;
    margin-top: 12px;
    padding-left: 24px;
    padding-right: 24px;
    font-family: montserrat;
    font-weight: 500;
    text-align: left;
}
.transcripts_container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1 1 auto;
}
.nav_button {
    display: flex;
    height: 36px;
    width: 36px;
    justify-content: center;
    align-items: center;
}

.action_button {
    height: 56px;
    width: 56px;
    border-radius: 28px;
    background-color: #009988;
    box-shadow: 0 0 2px rgba(0,0,0, 0.4);
    border: 0;
}

.action_buttons {
    float: right;
    display:flexbox;
    flex-direction: column;
}

.action_button:hover {
    background-color: #198376;
    cursor: pointer;
}

.action_button:active {
    opacity: 0.9;
}

.nav_button:hover {
    background-color: rgba(255, 255, 255, 0.2);
}
</style>
