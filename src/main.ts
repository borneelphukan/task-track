import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "./index.css";
import { format, formatDistance, parseISO } from "date-fns";

const app = createApp(App);

app.config.globalProperties.$filters = {
  formatDate(value: string): string | undefined {
    if (!value) return;
    let dateValue;
    try {
      dateValue = format(parseISO(value), "dd.MM.yyyy HH:mm:ss");
    } catch (e) {
      console.log(value);
      console.log(e);
    }
    return dateValue;
  },
  duration(from: string, to: string): string | undefined {
    if (!from || !to) {
      return;
    }
    let duration;
    try {
      duration = formatDistance(parseISO(from), parseISO(to));
    } catch (e) {
      console.log(e);
    }
    return duration;
  },
};
app.mount("#app");
