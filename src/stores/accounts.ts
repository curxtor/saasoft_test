import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Account } from '@/types/AccountTypes'
export const useAccountStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])
  function getFromLocalStorage() {
    const accountsFromLocalStorage = localStorage.getItem('accounts')
    if (accountsFromLocalStorage) {
      accounts.value = JSON.parse(accountsFromLocalStorage)
    }
  }
  function saveToLocalStorage() {
    localStorage.setItem('accounts', JSON.stringify(accounts.value))
  }
  function addAccount(account: Account) {
    accounts.value.push(account)
    saveToLocalStorage()
  }
  function deleteAccount(id: string) {
    accounts.value = accounts.value.filter((account) => account.id !== id)
    saveToLocalStorage()
  }
  function updateAccount(updated: Account) {
    const index =  accounts.value.findIndex((account) => account.id === updated.id)
    if (index !== -1) {
      accounts.value[index] = updated
      saveToLocalStorage()
    }
  }
  function getAccounts() {
    return computed(() => accounts.value)
  }
  return {
    getFromLocalStorage,
    addAccount,
    deleteAccount,
    updateAccount,
    getAccounts
  }
})
