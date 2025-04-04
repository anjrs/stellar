import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Ajoute cette ligne

const app = createApp(App);
app.use(router); // Active le router
app.mount("#app");
