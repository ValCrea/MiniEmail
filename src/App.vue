<script setup lang="ts">
import { ref } from "vue";
import SelectButton from "@/components/SelectButton.vue";

import { selectButtons } from "@/utils/button-util";

//const navButtons = ["Inbox", "Starred", "Important", "Spam", "Deleted"];
const selectedButton = ref(0);
</script>

<template>
  <div class="app">
    <section class="util">
      <button class="util__new">
        <font-awesome-icon icon="fa-solid fa-plus" />
        <p class="mobile-hidden">Compose</p>
      </button>
      <input class="util__search" placeholder="Search email" type="text" />
    </section>

    <section class="nav">
      <SelectButton
        v-for="(btn, index) in selectButtons"
        :key="btn.text"
        :selected="index === selectedButton"
        @click="selectedButton = index"
      >
        <font-awesome-icon
          :icon="btn.icon.type + ' ' + btn.icon.name"
          class="icon"
        />
        <span class="mobile-hidden">&nbsp;{{ btn.text }}</span>
      </SelectButton>
    </section>
  </div>
</template>

<style scoped lang="scss">
.app {
  width: 100%;
  padding: 1rem;
  background-color: $white;
}

.util {
  position: relative;
  padding: 0.35rem;

  border-block: solid 2px $light-gray;

  display: flex;
  flex-direction: row;
  align-items: baseline;

  &__new {
    padding-block: 0.5rem;
    padding-inline: 1rem;

    background-color: $white;
    border-radius: 0.2rem;
    border: solid 2px $blue;

    display: flex;
    gap: 0.8rem;

    &:hover {
      background-color: $light-blue;
    }
  }

  &__search {
    width: 100%;
    padding: 1rem;
    margin-left: 8rem;

    border: none;
    border-radius: 0.6rem;

    color: $gray;
    background-color: $light;

    &:focus {
      outline: none;
    }

    @media screen and (max-width: 768px) {
      margin-left: 2rem;
    }
  }
}

.nav {
  width: 15rem;
  padding-block: 0.5rem;

  display: flex;
  flex-direction: column;

  @media screen and (max-width: 768px) {
    width: 100%;
    flex-flow: wrap row;
    justify-content: space-between;

    border-bottom: solid 2px $light-gray;
  }
}

.icon {
  width: 1rem;
  height: 1rem;
}

.mobile-hidden {
  @media screen and (max-width: 768px) {
    display: none;
  }
}
</style>
