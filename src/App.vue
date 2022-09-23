<script setup lang="ts">
import { ref, type Ref } from "vue";

import SelectButton from "@/components/SelectButton.vue";
import EmailBlock from "@/components/EmailBlock.vue";

import { selectButtons } from "@/utils/button-util";
import { filters, counts } from "@/utils/mail-util";
import type { Mail } from "@/utils/mail-util";

const reading: Ref<Mail | null> = ref(null);
const selectedView = ref(0);
const mails: Ref<Mail[]> = ref([
  {
    author: "L",
    content: `ipsum dolor sit amet consectetur adipisicing elit.
              Rem, maxime officiis ratione vero minus minima consequuntur.
              Blanditiis, ipsa libero veniam praesentium a iste consectetur
              exercitationem iusto dolores! Eaque, atque et!`,
  },
  {
    author: "Lo",
    content: "Ipsem",
    read: true,
  },
  {
    author: "Lor",
    content: "Ipsem",
    star: true,
  },
  {
    author: "Lore",
    content: "Ipsem",
    read: true,
    important: true,
  },
]);

const toggleStar = (index: number) => {
  mails.value[index].star = !mails.value[index].star;
};
const toggleImportant = (index: number) => {
  mails.value[index].important = !mails.value[index].important;
};
const setRead = (index: number) => {
  mails.value[index].read = true;
  reading.value = mails.value[index];
};

const selectedAll = ref(false);
const toggleSelect = (index: number) => {
  mails.value[index].selected = !mails.value[index].selected;
};
const toggleSelectAll = () => {
  selectedAll.value = !selectedAll.value;
  mails.value.forEach((mail) => (mail.selected = selectedAll.value));
};
</script>

<template>
  <div class="app">
    <section class="util">
      <template v-if="!reading">
        <button class="util__button util__button--new">
          <font-awesome-icon icon="fa-solid fa-plus" />
          <p class="mobile-hidden">Compose</p>
        </button>
        <input class="util__search" placeholder="Search email" type="text" />
        <button @click="toggleSelectAll" class="util__select-all">
          <font-awesome-icon v-if="selectedAll" icon="fa-solid fa-check" />
        </button>
      </template>

      <button
        v-else
        @click="reading = null"
        class="util__button util__button--back"
      >
        <font-awesome-icon icon="fa-solid fa-arrow-left" />
        <p class="mobile-hidden">Back</p>
      </button>
    </section>

    <div v-if="reading" class="mail-single">
      <p class="mail-single__author">From: {{ reading.author }}</p>
      <p class="mail-single__content">{{ reading.content }}</p>
    </div>

    <div v-else class="mail-list">
      <section class="nav">
        <SelectButton
          v-for="(btn, index) in selectButtons"
          :key="btn.text"
          :selected="index === selectedView"
          @click="selectedView = index"
        >
          <font-awesome-icon
            :icon="btn.icon.type + ' ' + btn.icon.name"
            class="icon"
          />
          <span class="mobile-hidden">&nbsp;{{ btn.text }}</span>
          <span class="nav__count">{{ counts[index](mails) }}</span>
        </SelectButton>
      </section>

      <section class="mails">
        <template v-for="(mail, index) in mails" :key="mail">
          <EmailBlock
            v-if="filters[selectedView](mail)"
            :mail="mail"
            @set-read="setRead(index)"
            @toggle-star="toggleStar(index)"
            @toggle-important="toggleImportant(index)"
            @toggle-select="toggleSelect(index)"
          />
        </template>
      </section>
    </div>
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
  align-items: center;

  &__button {
    padding-block: 0.5rem;
    padding-inline: 1rem;

    display: flex;
    align-items: center;
    gap: 1rem;

    font-size: 0.9rem;
    border-radius: 0.2rem;

    &--new {
      background-color: $white;
      border: solid 2px $blue;
      color: $blue;

      &:hover {
        background-color: $light-blue;
      }
    }

    &--back {
      background-color: $white;
      border: solid 2px $gray;
      color: $gray;

      &:hover {
        background-color: $light-gray;
      }
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

  &__select-all {
    min-width: 1.4rem;
    min-height: 1.4rem;
    margin-inline: 0.6rem;

    border: none;
    border-radius: 0.2rem;
    background-color: $light-blue;
    cursor: pointer;
  }
}

.nav {
  min-width: 15rem;
  padding-block: 0.5rem;

  display: flex;
  flex-direction: column;

  &__count {
    //float: right;
    margin-left: auto;
    font-size: 0.75rem;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    flex-flow: wrap row;
    justify-content: space-between;

    border-bottom: solid 2px $light-gray;
  }
}

.mails {
  width: 100%;
  margin-left: 0.6rem;
  padding-block: 0.5rem;

  display: flex;
  flex-direction: column;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  @media screen and (max-width: 768px) {
    margin-left: 0;
  }
}

.mail-list {
  display: flex;
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
}

.mail-single {
  margin: 1rem;
  padding: 1rem;

  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  background-color: $light;

  &__author {
    font-size: 1.2rem;
  }

  &__content {
    text-indent: 2rem;
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
