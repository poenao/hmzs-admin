import { createApp } from "vue";
import App from "./App.vue";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./styles/index.scss";

import { createPinia } from "pinia";
import router from "./router";
// 注意：在router引入之后引入
import "./permission";
const app = createApp(App);

app.use(ElementPlus);
app.use(createPinia());
app.use(router);

app.mount("#app");
