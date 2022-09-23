<script setup lang="ts">
import { ref, type Ref, watch, nextTick } from "vue";
import debounce from "lodash/debounce";

import SelectButton from "@/components/SelectButton.vue";
import EmailBlock from "@/components/EmailBlock.vue";

import { selectButtons } from "@/utils/button-util";
import { filters, counts, matchesPhrase } from "@/utils/mail-util";
import type { Mail } from "@/utils/mail-util";

const writing = ref(false);
const reading: Ref<Mail | null> = ref(null);
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
    author: "TEST",
    content: "Hello world a bunch of random words",
    star: true,
  },
  {
    author: "test",
    content: "mIpsem",
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
  mails.value[index].important = false;
  reading.value = mails.value[index];
};

const selectedAll = ref(false);
const selectedMails = ref(new Set<number>());
const toggleSelect = (index: number, toggleTo?: boolean) => {
  if (toggleTo !== undefined) {
    mails.value[index].selected = toggleTo;
    if (toggleTo) selectedMails.value.add(index);
    else selectedMails.value.delete(index);
    return;
  }

  if (selectedMails.value.has(index)) selectedMails.value.delete(index);
  else selectedMails.value.add(index);

  mails.value[index].selected = !mails.value[index].selected;
};
const toggleSelectAll = (selectedStatus: boolean) => {
  selectedAll.value = selectedStatus;
  mails.value.forEach((mail, index) => {
    if (filters[selectedView.value](mail))
      toggleSelect(index, selectedAll.value);
  });
};

const selectedView = ref(0);
const setView = (view: number) => {
  selectedView.value = view;
  reading.value = null;
  writing.value = false;
  toggleSelectAll(false);
};

const markSpam = () => {
  selectedMails.value.forEach((m_ind) => {
    mails.value[m_ind].spam = true;
  });
};
const markDelete = () => {
  selectedMails.value.forEach((m_ind) => {
    mails.value[m_ind].deleted = true;
  });
};

const userSearch = ref("");
const userSearching = ref("");
watch(
  userSearching,
  debounce(() => (userSearch.value = userSearching.value.toLowerCase()), 500)
);

const readingContent = ref();
const highlightSearch = () => {
  if (!reading.value || !readingContent.value) return;

  const content = reading.value.content;
  if (!userSearch.value) {
    readingContent.value.innerHTML = content;
    return;
  }

  let highlight = "";
  const srLen = userSearch.value.length;
  const regex = new RegExp(userSearch.value, "gi");

  let match;
  let lastMatch = 0;
  while ((match = regex.exec(content)) != null) {
    let until = content.substring(lastMatch, match.index);
    let part = content.substring(match.index, match.index + srLen);

    highlight = `${highlight}${until}<span class="highlight">${part}</span>`;
    lastMatch = match.index + srLen;
  }
  highlight = `${highlight}${content.substring(lastMatch, content.length)}`;

  readingContent.value.innerHTML = highlight;
};
watch(reading, () => nextTick(highlightSearch));
watch(userSearch, () => nextTick(highlightSearch));

const inputFrom = ref("");
const inputContent = ref("");
const sendMail = () => {
  writing.value = false;
  mails.value.push({
    author: inputFrom.value,
    content: inputContent.value,
  });
};
</script>

<template>
  <div class="app">
    <section class="util">
      <button
        v-if="reading || writing"
        @click="
          reading = null;
          writing = false;
        "
        class="util__button util__button--back"
      >
        <font-awesome-icon icon="fa-solid fa-arrow-left" />
        <p class="mobile-hidden">Back</p>
      </button>

      <template v-else>
        <template v-if="selectedMails.size > 0">
          <button @click="markSpam" class="util__button util__button--spam">
            <font-awesome-icon icon="fa-solid fa-ban" />
            <p class="mobile-hidden">Spam</p>
          </button>

          <button @click="markDelete" class="util__button util__button--delete">
            <font-awesome-icon icon="fa-solid fa-trash" />
            <p class="mobile-hidden">Delete</p>
          </button>
        </template>

        <button
          v-else
          @click="writing = true"
          class="util__button util__button--new"
        >
          <font-awesome-icon icon="fa-solid fa-plus" />
          <p class="mobile-hidden">Compose</p>
        </button>
      </template>

      <input
        v-model="userSearching"
        class="util__search"
        placeholder="Search email"
        type="text"
      />

      <button
        v-if="!reading && !writing"
        @click="toggleSelectAll(!selectedAll)"
        class="util__select-all"
      >
        <font-awesome-icon v-if="selectedAll" icon="fa-solid fa-check" />
      </button>
    </section>

    <div class="mail-list">
      <section class="nav">
        <SelectButton
          v-for="(btn, index) in selectButtons"
          :key="btn.text"
          :selected="index === selectedView"
          @click="setView(index)"
        >
          <font-awesome-icon
            :icon="btn.icon.type + ' ' + btn.icon.name"
            class="icon"
          />
          <span class="mobile-hidden">&nbsp;{{ btn.text }}</span>
          <span class="nav__count mobile-hidden">{{
            counts[index](mails)
          }}</span>
        </SelectButton>
      </section>

      <section v-if="reading" class="mail-list__read">
        <p class="mail-single__author">From: {{ reading.author }}</p>
        <p ref="readingContent" class="mail-single__content"></p>
      </section>

      <section v-else-if="writing" class="new-mail">
        <div class="new-mail__from-form">
          <label for="from">From: </label>
          <input
            v-model="inputFrom"
            class="new-mail__from"
            id="from"
            type="text"
          />
        </div>
        <textarea
          v-model="inputContent"
          class="new-mail__content"
          name=""
          id=""
          cols="30"
          rows="10"
        ></textarea>
        <button
          @click="sendMail"
          :class="{ 'new-mail__send--disabled': !inputFrom || !inputContent }"
          class="new-mail__send"
        >
          Send
        </button>
      </section>

      <section v-else class="mail-list__mails">
        <template v-for="(mail, index) in mails" :key="mail">
          <EmailBlock
            v-if="
              filters[selectedView](mail) && matchesPhrase(mail, userSearch)
            "
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
    margin-right: 8rem;
    margin-block: 1rem;

    display: flex;
    align-items: center;
    gap: 1rem;

    font-size: 0.9rem;
    border-radius: 0.2rem;
    background-color: $white;

    @media screen and (max-width: 768px) {
      margin-right: 1rem;
    }

    &--new {
      border: solid 2px $blue;
      color: $blue;

      &:hover {
        background-color: $light-blue;
      }

      @media screen and (max-width: 768px) {
        margin-right: 1rem;
      }
    }

    &--back {
      margin-right: 9.8rem;
      border: solid 2px $gray;
      color: $gray;

      &:hover {
        background-color: $light-gray;
      }

      @media screen and (max-width: 768px) {
        margin-right: 1rem;
      }
    }

    &--spam {
      margin-right: 1rem;
      padding-inline: 0.5rem;
      gap: 0.5rem;

      border: solid 2px $gray;
      color: $gray;

      &:hover {
        background-color: $light-gray;
      }

      @media screen and (max-width: 768px) {
        margin-right: 1rem;
      }
    }

    &--delete {
      margin-right: 4.8rem;
      padding-inline: 0.5rem;
      gap: 0.5rem;

      border: solid 2px $red;
      color: $red;

      &:hover {
        background-color: $light-red;
      }

      @media screen and (max-width: 768px) {
        margin-right: 1rem;
      }
    }
  }

  &__search {
    width: 100%;
    padding: 1rem;

    border: none;
    border-radius: 0.6rem;

    color: $gray;
    background-color: $light;

    &:focus {
      outline: none;
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

.mail-list {
  display: flex;
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }

  &__read {
    width: 100%;
    margin: 1rem;
    padding: 1rem;

    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    background-color: $light;
    border-radius: 1rem;

    &__author {
      font-size: 1.2rem;
    }

    &__content {
      text-indent: 2rem;
    }
  }

  &__mails {
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
}

.new-mail {
  width: calc(100% - 15rem);
  padding: 1rem;
  margin: 1rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  background-color: $light;
  border-radius: 1rem;

  @media screen and (max-width: 768px) {
    width: 95%;
  }

  &__from-form {
    font-size: 1.2rem;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }

  &__from {
    padding: 0.25rem;
    font-size: 1.2rem;
    border: solid 1px $light-gray;
    border-radius: 0.25rem;

    flex: 1;

    &:focus {
      outline: none;
      border: solid 1px $gray;
    }
  }

  &__content {
    max-width: 100%;
    padding: 0.5rem;

    font-size: 1rem;

    border: solid 1px $light-gray;
    border-radius: 0.5rem;

    resize: none;
    flex: 1;

    &:focus {
      outline: none;
      border: solid 1px $gray;
    }
  }

  &__send {
    padding: 0.25rem;
    width: 35%;

    font-size: 1.1rem;
    border: solid 1px $gray;
    border-radius: 0.5rem;
    background-color: $white;

    align-self: center;
    cursor: pointer;

    &:hover {
      background-color: $light-gray;
    }

    &--disabled {
      cursor: not-allowed;
      color: $gray;
      background-color: $light-gray;
    }
  }
}

.icon {
  width: 1rem;
  height: 1rem;
}

:global(.highlight) {
  background-color: $highlight-blue;
}

.mobile-hidden {
  @media screen and (max-width: 768px) {
    display: none;
  }
}
</style>
