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
  faStar as starSolid,
  faBookmark as bookmarkSolid,
  faArrowLeft,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  faStar as starRegular,
  faBookmark as bookmarkRegular,
} from "@fortawesome/free-regular-svg-icons";

library.add(
  faUserSecret,
  faPlus,
  faInbox,
  faBan,
  faTrash,
  bookmarkSolid,
  bookmarkRegular,
  starSolid,
  starRegular,
  faArrowLeft,
  faCheck
);

createApp(App).component("font-awesome-icon", FontAwesomeIcon).mount("#app");
