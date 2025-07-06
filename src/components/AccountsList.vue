<template>
  <!-- <AccountForm v-for="account in accounts" :key="account.id" :account="account" /> -->
  <n-table :bordered="false">
    <thead>
      <tr>
        <th>Метка</th>
        <th>Тип записи</th>
        <th>Логин</th>
        <th>Пароль</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <TransitionGroup name="list">
        <tr v-for="account in accounts" :key="account.id">
          <td>
            <n-input
              v-model:value="account.label"
              placeholder="Метки"
              :status="accountErrors[account.id]?.label ? 'error' : undefined"
              @blur="validateAndSave(account)"
            />
          </td>
          <td>
            <n-select
              v-model:value="account.accountType"
              @update:value="validateAndSave(account)"
              :options="selectVars"
            />
          </td>
          <td v-if="account.accountType !== 'Local'" colspan="2">
            <n-input
              v-model:value="account.login"
              placeholder="Логин"
              :status="accountErrors[account.id]?.login ? 'error' : undefined"
              @blur="validateAndSave(account)"
            />
          </td>
          <template v-else>
            <td>
              <n-input
                v-model:value="account.login"
                placeholder="Логин"
                :status="accountErrors[account.id]?.login ? 'error' : undefined"
                @blur="validateAndSave(account)"
              />
            </td>
            <td>
              <n-input
                v-model:value="account.password"
                type="password"
                show-password-on="click"
                placeholder="Пароль"
                :status="accountErrors[account.id]?.password ? 'error' : undefined"
                @blur="validateAndSave(account)"
              />
            </td>
          </template>
          <td>
            <img
              width="24"
              src="../assets/trashbox.svg"
              class="delete_button"
              @click="deleteAccount(account.id)"
            />
          </td>
        </tr>
      </TransitionGroup>
    </tbody>
  </n-table>
</template>

<script setup lang="ts">
import AccountForm from "./AccountForm.vue";
import { useAccountStore } from "@/stores/accounts";
import type { AccountLabel } from "@/types/AccountTypes";
import { NTable, NInput, NSelect } from "naive-ui";
import { reactive } from "vue";
const accountStore = useAccountStore();
const accounts = accountStore.getAccounts();

interface AccountError {
  label: string;
  login: string;
  password: string;
}
const passwordVisibility = reactive<Record<string, boolean>>({});
function togglePasswordVisibility(id: string) {
  passwordVisibility[id] = !passwordVisibility[id];
}

const accountErrors = reactive<Record<string, AccountError>>(
  Object.fromEntries(accounts.value.map((acc) => [acc.id, { label: "", login: "", password: "" }]))
);
const selectVars = reactive([
  {
    label: "LDAP",
    value: "LDAP",
  },
  {
    label: "Локальная",
    value: "Local",
  },
]);

function labelsToString(labels: AccountLabel[]): string {
  return labels.map((l) => l.text.trim()).join("; ");
}

function stringToLabels(str: string): AccountLabel[] {
  return str
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .map((text) => ({ text }));
}

function validate(account: any) {
  const errors = {
    label: "",
    login: "",
    password: "",
  };
  if (account.label && !account.label.split(";").every((part: string) => part.trim())) {
    errors.label = "invalid";
  }
  if (!account.login) {
    errors.login = "required";
  } else if (account.login.length > 100) {
    errors.login = "too_long";
  }

  // Пароль обязателен только для Local аккаунта
  if (account.accountType === "Local") {
    if (!account.password) {
      errors.password = "required";
    } else if (account.password.length > 100) {
      errors.password = "too_long";
    }
  }
  return errors;
}
function deleteAccount(id: string) {
  accountStore.deleteAccount(id);
}
function validateAndSave(account: any) {
  const errors = validate(account);
  console.log(errors);
  // Обновляем ошибки по ID
  accountErrors[account.id] = errors;

  // Сохраняем только если нет критических ошибок
  if (
    !errors.login &&
    (!account.accountType || account.accountType !== "Local" || !errors.password)
  ) {
    account.accountType == "LDAP" ? (account.password = null) : null;
    account.labels = stringToLabels(account.label);
    account.label = labelsToString(account.labels);
    accountStore.updateAccount(account);
    console.log(account);
  }
}
</script>
<style scoped>
.delete_button {
  cursor: pointer;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
