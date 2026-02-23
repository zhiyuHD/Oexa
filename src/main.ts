import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import 'mdui/mdui.css';
import 'mdui';
document.documentElement.classList.add('mdui-theme-dark');
createApp(App).mount("#app");
