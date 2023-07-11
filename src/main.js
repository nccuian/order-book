import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())

// 全域屬性
app.config.globalProperties.$filter = {
  formatCommas: (num) => {
    if (!num) return
    const parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
}

app.mount('#app')
