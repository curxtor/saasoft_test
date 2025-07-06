<template>
  <header>
    <span class="head_text">Учетные записи</span>
    <n-button @click="addNewAccount">+</n-button>
  </header>
  <div class="head_warning">
    <img src="../assets/question.svg" width="24" />
    <span>Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</span>
  </div>
</template>
<script setup lang="ts">
import { useAccountStore } from "@/stores/accounts";
import { NButton } from "naive-ui";
import { v4 as uuidv4 } from "uuid";
const accountStore = useAccountStore();
function addNewAccount() {
  const account = {
    id: uuidv4(),
    label: "",
    accountType: "Local" as const,
    login: "",
    password: "",
  };
  accountStore.addAccount(account);
}
</script>
<style scoped>
header {
  display: flex;
  align-items: center;
  width: fit-content;
  gap: 10px;
}
.head_text {
  font-size: 18px;
  font-weight: 500;
}
.head_warning {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #eef4fa;
  padding: 0.5em 1em;
}
</style>
