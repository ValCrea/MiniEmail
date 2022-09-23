<script setup lang="ts">
import { getSolid } from "@/utils/icon-utils";
import type { Mail } from "@/utils/mail-util";

const props = defineProps<{
  mail: Mail;
}>();

const emit = defineEmits<{
  (e: "toggleStar"): void;
  (e: "toggleImportant"): void;
  (e: "setRead"): void;
  (e: "toggleSelect"): void;
}>();
</script>

<template>
  <div @click="emit('setRead')" :class="{ read: props.mail.read }" class="mail">
    <font-awesome-icon
      @click.stop="emit('toggleStar')"
      :class="{ 'mail__icon--gold': props.mail.star }"
      :icon="getSolid(props.mail.star) + ' fa-star'"
      class="mail__icon"
    />
    <font-awesome-icon
      @click.stop="emit('toggleImportant')"
      :class="{ 'mail__icon--blue': props.mail.important }"
      :icon="getSolid(props.mail.important) + ' fa-bookmark'"
      class="mail__icon"
    />
    <span class="mail__author">{{ props.mail.author }}</span>
    <span class="mail__content">{{ props.mail.content }}</span>
    <button @click.stop="emit('toggleSelect')" class="mail__select">
      <font-awesome-icon v-if="props.mail.selected" icon="fa-solid fa-check" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.mail {
  padding: 1rem;
  border-bottom: solid 1px $light-gray;

  display: flex;
  flex-direction: row;
  background-color: $light;

  &:hover {
    background-color: $white;
  }

  &__icon {
    margin-right: 1rem;
    color: $gray;
    cursor: pointer;

    &--gold {
      color: $gold;
    }

    &--blue {
      color: $blue;
    }
  }

  &__author {
    min-width: 10rem;
    max-width: 10rem;
    margin-right: 0.5rem;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    @media screen and (max-width: 768px) {
      min-width: 6rem;
      max-width: 6rem;
    }
  }

  &__content {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 0.5rem;
  }

  &__select {
    margin-left: auto;
    min-width: 1.2rem;
    min-height: 1rem;

    color: $blue;
    border: none;
    border-radius: 0.2rem;
    background-color: $light-blue;
    cursor: pointer;
  }
}

.read {
  color: $gray;
}
</style>
