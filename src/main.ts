import { createApp } from 'vue'
import App from './App.vue'
import { vReveal } from './composables/useReveal'
import './styles/main.scss'

createApp(App).directive('reveal', vReveal).mount('#app')
