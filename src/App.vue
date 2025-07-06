<template>
  <div class="test_task_form">
    <AppHeader />
    <AccountsList />
  </div>
</template>

<script setup lang="ts">
import AccountsList from "./components/AccountsList.vue";
import AppHeader from "./components/AppHeader.vue";
</script>

<style scoped>
.test_task_form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 10px;
}
</style>
