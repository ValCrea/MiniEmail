<script setup lang="ts">
const props = defineProps<{
  selected: boolean;
}>();
</script>

<template>
  <div
    class="button"
    :class="{
      'button--selected': props.selected,
      'button--hoverable': !props.selected,
    }"
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
.button {
  padding: 1rem;

  color: $black;
  border-top-right-radius: 9999em;
  border-bottom-right-radius: 9999em;

  cursor: pointer;
  transition: background-color 0.25s ease-out;

  display: flex;
  align-items: center;

  &--hoverable:hover {
    background-color: $light;
  }

  &--selected {
    color: $blue;
    background-color: $light-blue;
  }

  @media screen and (max-width: 768px) {
    border-top-left-radius: 9999em;
    border-bottom-left-radius: 9999em;
  }
}
</style>
