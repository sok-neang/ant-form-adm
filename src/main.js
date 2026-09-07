
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


import App from './App.vue'
import router from './router/index.js'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './assets/main.css';
import "tom-select/dist/css/tom-select.css";
import VueApexCharts from 'vue3-apexcharts'
import BaseSkeleton from "@/components/ui/base/BaseSkeleton.vue"

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus)
app.use(router)
app.use(VueApexCharts)

app.component('BaseSkeleton', BaseSkeleton)
app.mount('#app')
