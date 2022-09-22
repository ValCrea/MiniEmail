import { createApp } from "vue";
import App from "./App.vue";

import "./assets/main.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faUserSecret,
  faPlus,
  faInbox,
  faBan,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faStar, faBookmark } from "@fortawesome/free-regular-svg-icons";

library.add(faUserSecret, faPlus, faInbox, faStar, faBan, faTrash, faBookmark);

createApp(App).component("font-awesome-icon", FontAwesomeIcon).mount("#app");
