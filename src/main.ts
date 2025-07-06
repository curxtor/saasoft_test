import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useAccountStore } from './stores/accounts'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')

const accountStore = useAccountStore()
accountStore.getFromLocalStorage()