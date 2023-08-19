<script setup lang="ts">
import type { TodoItem } from "../types";
import { computed, ref, toRefs } from "vue";

const $p = withDefaults(
  defineProps<{
    data: TodoItem;
    hello?: string;
  }>(),
  {
    hello: "test1",
  }
);

const { data } = toRefs($p);

const emit = defineEmits<{
  (e: "delete", data: TodoItem): void;
  (e: "edit", data: TodoItem): void;
  (e: "save", data: TodoItem, inputValue: string): void;
  (e: "checked", data: TodoItem, checkedValue: boolean): void;
}>();
// const [value, toggle] = useToggle();

// reactive values
const editedItem = ref<TodoItem | undefined>();
const editedTask = ref<string | undefined>();
const checkedValue = ref<boolean>(data.value?.completed ?? false);

// computed values
const inputValue = computed(() => {
  if (!editedTask.value) {
    return;
  }

  return editedTask.value;
});
</script>

<template>
  <!-- <button @click="toggle()">Toggle</button>
    <p>Value: {{ value ? "ON" : "OFF" }}</p> -->
  <div class="flex w-full justify-between">
    <!--Taskname-->
    <div class="w-[20%] flex justify-center items-center h-10">
      <p>{{ data.taskName }}</p>
    </div>
    <!-- Status -->
    <div class="w-[20%] flex justify-center items-center h-10">
      <p>{{ data.completed ? "completed" : "active" }}</p>
    </div>

    <!--Date Created-->
    <div class="w-[20%] flex justify-center items-center h-10">
      <p>{{ $filters.formatDate(data.startDate) }}</p>
    </div>

    <!-- Date Ended-->
    <div class="w-[20%] flex justify-center items-center h-10">
      <p>{{ $filters.formatDate(data.endDate) }}</p>
    </div>

    <!--Duration -->
    <!-- <div class="">
        <p>{{ $filters.duration(data.startDate, data.endDate) }}</p>
      </div> -->

    <!--Edit Textbox-->
    <div v-show="editedItem === data" class="flex">
      <input
        v-model="editedTask"
        type="text"
        placeholder="Edit Task"
        class="focus:ring focus:ring-violet-300 shadow appearance-none border rounded-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        @keyup.enter="
          emit('save', data, `${inputValue}`),
            (editedTask = data.taskName),
            (editedItem = data)
        "
      />
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mx-3"
        @click="
          emit('save', data, inputValue || ''),
            (editedTask = data.taskName),
            (editedItem = data)
        "
      >
        SAVE
      </button>
    </div>
    <!--EDIT, DELETE, TOGGLE COMPLETED-->
    <div class="flex items-center justify-center w-[20%] h-10">
      <button
        class="bg-green-500 hover:bg-green-700 text-white font-bold rounded-full px-4 py-2 mr-4"
        @click="
          emit('edit', data), (editedItem = data), (editedTask = data.taskName)
        "
      >
        EDIT
      </button>

      <button
        class="bg-red-500 hover:bg-red-700 text-white font-bold rounded-full px-4 py-2 mr-8"
        @click="emit('delete', data)"
      >
        DELETE
      </button>

      <!--Completed Checkbox-->
      <div class="flex items-center">
        <input
          id="completed"
          v-model="checkedValue"
          class="w-5 h-5"
          type="checkbox"
          name="completed"
          @change="emit('checked', data, checkedValue)"
        />
      </div>
    </div>
  </div>
</template>
