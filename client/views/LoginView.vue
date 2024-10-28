<script setup lang="ts">
import LoginForm from "@/components/Login/LoginForm.vue";
import RegisterForm from "@/components/Login/RegisterForm.vue";
import { ref } from 'vue';

const selectedTab = ref(0)
const getTabClass = (tabIndex: number) => {
    return selectedTab.value === tabIndex ? 'selected_tab' : 'unselected_tab'
}
const onTabSelected = async (tabIndex: number) => {
    selectedTab.value = tabIndex
}

</script>

<template>
  <main>
    <div class="container">
      <div class="content">
        <img src="../assets/images/logo.png" />
        <p class="description">Akaranga is a platform where communities can connect, learn, and contribute to the preservation of their cultural heritage</p>
        <div class='login_container'>
          <div class='login_tabs'>
              <button class="tab" :class="getTabClass(0)" @click="onTabSelected(0)">Login</button>
              <button class="tab" :class="getTabClass(1)" @click="onTabSelected(1)">Register</button>
          </div>
          <div class="sidebar_content">
              <LoginForm v-if="selectedTab === 0" />
              <RegisterForm v-else />
          </div>
        </div>
    </div>
    </div>
    
  </main>
</template>
<style scoped>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 32px
  }

  .login_tabs {
    display: flex;
    flex-direction: row;
    flex: 0 1 40px;
    box-shadow: 0 0 2px rgba(0,0,0, 0.4);
}
  .login_container {
    width: 500px;
    display: flex;
    flex-flow: column;
    margin-left: 16px;
    box-shadow: 0 0 2px rgba(0,0,0, 0.4);
    border-radius: 4px;
    overflow: hidden;
}
  .description {
    font-size: 24px;
    text-align: center;
  }
  .content {
    width: 500px;
  }

  .tab {
    border: 0;
    width: 250px;
    flex-basis: 33.33%;
    flex-grow: 0;
    flex: 1 1 auto;
}
.unselected_tab {
    background-color: #e0ebea;
    font-weight: 600;
}

.unselected_tab:hover {
    background-color: #d1e1df;
}

.selected_tab {
    background-color: #198376;
    font-weight: 600;
    color: white;
}
</style>