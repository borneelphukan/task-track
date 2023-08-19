<script setup lang="ts">
import { computed } from "vue";
const $p = withDefaults(
  defineProps<{
    actionKey?: string | null;
    label?: string;
    isActive?: boolean;
  }>(),
  {
    actionKey: null,
    label: "Do anything",
    isActive: false,
  }
);
const emit = defineEmits<{
  (e: "click", actionKey: string, event: Event): void;
}>();
function click(event: Event) {
  return emit("click", `${actionKey.value}`, event);
}
const actionKey = computed(() => {
  return $p.actionKey;
});
</script>

<!-- Visual jsx -->

<template>
  <button
    :class="{ active: isActive }"
    class="hover:bg-yellow-500 text-yellow-700 font-semibold hover:text-white py-2 px-4 border border-yellow-500 hover:border-transparent rounded mx-3"
    @click="click"
  >
    <h3>{{ label }}</h3>
  </button>
</template>

<style scoped>
.active {
  background-color: #3b82f6;
  color: antiquewhite;
}
</style>
