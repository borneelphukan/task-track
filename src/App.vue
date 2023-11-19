<script setup lang="ts">
import { computed, onUpdated, reactive, ref } from "vue";
import { useStorage } from "@vueuse/core";
import type { TodoItem, TodoListState } from "./types";
import ToDoList from "./components/ToDoList.vue";
import Button from "./components/Button.vue";

// Template Ref declarations
const rawTask = ref("");
const bulkRawTask = ref("");
const tasks = useStorage("app.tasks", new Set<TodoItem>());
const currentTaskList = ref<TodoListState>("all");
const checkedValue = ref<boolean>(false);
const bulkToggle = ref<boolean>(false);
const toggleView = ref<boolean>(false);

// Reactive computed getters:
function setCurrentTaskList(list: TodoListState) {
  currentTaskList.value = list;
}
const filteredTasks = computed(() => {
  if (currentTaskList.value === "active") {
    return [...tasks.value].filter((i) => !i.completed);
  }
  if (currentTaskList.value === "completed") {
    return [...tasks.value].filter((i) => i.completed);
  }
  if (currentTaskList.value === "all") {
    return [...tasks.value];
  }
  return [...tasks.value].filter((i) => !i.completed);
});
const activeTasks = computed(() =>
  [...tasks.value].filter((i) => !i.completed)
);
onUpdated(() => {
  const completedCheckBox = checkedValue.value;
  return completedCheckBox;
});

// ID generator
let guid = () => {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
};
/* Delete task */
function deleteTask(data: TodoItem) {
  tasks.value.delete(data);
}

/* Save edited Item */
function saveEditedItem(data: TodoItem, inputValue: string) {
  let editedTask = inputValue;
  const tasksClone = [...tasks.value];
  if (!editedTask) return;
  const itemIndex = tasksClone.findIndex(({ id }) => id === data.id);
  if (itemIndex === -1) return;
  tasksClone[itemIndex] = {
    ...data,
    taskName: editedTask,
  };
  tasks.value = new Set(tasksClone);
}

/* Save completed Item */
function saveCheckedItem(data: TodoItem, completedTask?: boolean) {
  const now = new Date();
  const tasksClone = [...tasks.value];
  const itemIndex = tasksClone.findIndex(({ id }) => id === data.id);
  if (itemIndex === -1) return;
  tasksClone[itemIndex] = {
    ...data,
    completed: completedTask,
    endDate: completedTask ? now.toISOString() : undefined,
  };
  tasks.value = new Set(tasksClone);
}

/* Reveal single task */
function SingleTaskReveal() {
  const BulkCandidateString = bulkRawTask.value; // input value
  console.log(BulkCandidateString, "BulkCandidateString");
  BulkCandidateString.split(/^/gm)
    .map((e) => {
      console.log(e, "splited");
      return e.replace("\n", "");
    })
    .filter((e) => {
      return !!e;
    })
    .map((e) => {
      console.log(e, "last");
      return addBulkTask(e);
    });
  bulkRawTask.value = "";
}

/* Find duplicated names */
function isDuplicateInActiveList(
  list: TodoItem[],
  value: string,
  key: "taskName"
): boolean {
  for (let i = 0; i < list.length; i++) {
    if (list[i][key] === value) {
      return true;
    }
  }
  return false;
}

/* Submit task */
function submitTask() {
  if (!rawTask.value) return;
  addTask(rawTask.value);
  rawTask.value = "";
}

/* Add single task */
function addTask() {
  if (isDuplicateInActiveList(activeTasks.value, rawTask.value, "taskName")) {
    alert("Sorry, this task is already in your list");
    return;
  }
  const now = new Date();
  return tasks.value.add({
    id: guid(),
    taskName: rawTask.value,
    completed: false,
    startDate: now.toISOString(),
    endDate: undefined,
    duration: undefined,
  });
}
function addBulkTask(taskName: string) {
  const now = new Date();
  return tasks.value.add({
    id: guid(),
    taskName: taskName,
    completed: false,
    startDate: now.toISOString(),
    endDate: undefined,
    duration: undefined,
    runningTime: ref("0"),
  });
}

/* Task Duration */
function getdate(startDate: string, endDate?: string) {
  const started = new Date(startDate).getTime();
  const ended = (endDate ? new Date(endDate) : new Date()).getTime();
  return Math.ceil((ended - started) / 1000);
}
const now = computed(() => new Date());
const r = reactive({ now: now, test: "x" });
</script>

<!-- Visual jsx -->
<template>
  <div id="app">
    <div class="relative">
      <h2 class="text-3xl font-bold">TaskTrack</h2>
      <div v-if="!bulkToggle">
        <div class="flex justify-center items-center relative">
          <input
            v-model="rawTask"
            class="focus:ring focus:ring-violet-300 shadow appearance-none border rounded-full py-2 px-3 text-gray-700 leading-tight focus:outline-none w-80 m-5 focus:shadow-outline"
            type="text"
            placeholder="Enter Task"
            @keyup.enter="submitTask"
          />

          <div class="relative" title="  Bulk-add a list of tasks">
            <div title="Bulk-add a list of tasks">
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                class="absolute right-32 top-3 cursor-pointer"
                @click="bulkToggle = !bulkToggle"
              >
                <path
                  fill="#3B82F6"
                  d="M9 14V8H5l7-7l7 7h-4v6H9m-4 4v-2h14v2H5m14 2H5v2h14v-2Z"
                ></path>
              </svg>
            </div>

            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mx-3"
              @click="submitTask"
            >
              ADD
            </button>
          </div>
        </div>
      </div>
      <div v-if="bulkToggle" class="flex justify-center my-4">
        <div class="flex flex-col" title="Add single task relative">
          <label class="pb-2 text-xl" for="story"
            >Enter your list of tasks here:</label
          >

          <textarea
            id="story"
            v-model="bulkRawTask"
            placeholder="− Task 1
  − Task 2
  − Task 3"
            name="story"
            rows="3"
            cols="33"
            class="focus:ring focus:ring-violet-300 leading-10 shadow appearance-none border rounded-sm px-2 text-gray-400 mb-4 focus:outline-none w-80 focus:shadow-outline"
          >
          </textarea>
          <svg
            class="relative bottom-32 left-[290px] cursor-pointer"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            @click="bulkToggle = !bulkToggle"
          >
            <path
              fill="#3B82F6"
              d="M5 20h14v-2H5v2zm0-10h4v6h6v-6h4l-7-7l-7 7z"
            ></path>
          </svg>
        </div>
        <div class="flex items-center">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mx-3 h-[2.5rem]"
            @click="SingleTaskReveal"
          >
            ADD
          </button>
        </div>
      </div>
      <!-- Buttons -->
      <div class="mb-5 flex justify-center">
        <my-button
          action-key="active"
          label="Active tasks"
          :is-active="currentTaskList === 'active'"
          @click="setCurrentTaskList"
        />
        <my-button
          action-key="completed"
          label="Completed tasks"
          :is-active="currentTaskList === 'completed'"
          @click="setCurrentTaskList"
        />
        <my-button
          action-key="all"
          label="All tasks"
          :is-active="currentTaskList === 'all'"
          @click="setCurrentTaskList"
        />
      </div>

      <!-- Toggle view list/history -->
      <div class="">
        <button
          class="border p-2 rounded border-yellow-500 text-white bg-blue-500 hover:bg-blue-700 min-w-[250px] w-[23%]"
          @click="toggleView = !toggleView"
        >
          {{ toggleView ? "View Tasks" : "View History" }}
        </button>
      </div>

      <div v-if="!toggleView" class="m-10">
        <h1 class="text-3xl font-bold mb-6">Task List</h1>

        <div class="flex justify-between mb-8 border-b-2 w-[80vw] mx-auto">
          <h3 class="w-[20%] text-sm sm:text-lg">Task Name</h3>
          <h3 class="w-[20%] text-sm sm:text-lg">Status</h3>
          <h3 class="w-[20%] text-sm sm:text-lg">Date Created</h3>
          <h3 class="w-[20%] text-sm sm:text-lg">Date Completed</h3>
          <h3 class="w-[20%] text-sm sm:text-lg">Functions</h3>
        </div>

        <ul
          id="tasks"
          class="w-[80vw] mx-auto flex justify-between flex-col mb-8"
        >
          <li
            v-for="item in filteredTasks"
            :key="item.taskName"
            class="flex justify-between my-2 h-10"
          >
            <ToDoList
              :data="item"
              @delete="deleteTask"
              @save="saveEditedItem"
              @checked="saveCheckedItem"
            />
          </li>
          <p v-if="tasks.size === 0" class="text-red-500">No Task Exists</p>
        </ul>
      </div>

      <!-- Task History -->
      <div v-else class="m-10">
        <h1 class="text-3xl font-bold mb-6">Task History Log</h1>

        <div class="flex justify-between mb-8 border-b-2 w-[80vw] mx-auto">
          <h3 class="w-[20%] text-sm sm:text-lg">Task Name</h3>
          <h3 class="w-[20%] text-sm sm:text-lg">Status</h3>
          <h3 class="w-[20%] text-sm sm:text-lg">Date Created</h3>
          <h3 class="w-[20%] text-sm sm:text-lg">Date Completed</h3>
          <h3 class="w-[20%] text-sm sm:text-lg">Duration</h3>
        </div>

        <ul
          v-if="tasks"
          class="w-[80vw] mx-auto flex justify-between flex-col mb-8"
        >
          <li
            v-for="task in tasks"
            :key="task.taskName"
            class="flex justify-between my-2 h-10"
          >
            <div class="w-[20%] flex justify-center items-center">
              <p>{{ task.taskName }}</p>
            </div>
            <div class="w-[20%] flex justify-center items-center">
              <p>{{ task.completed ? "completed" : "active" }}</p>
            </div>
            <div class="w-[20%] flex justify-center items-center">
              <p>{{ $filters.formatDate(task.startDate) }}</p>
            </div>

            <div class="w-[20%] flex justify-center items-center">
              <p>{{ $filters.formatDate(task.endDate) }}</p>
            </div>
            <div class="w-[20%] flex justify-center items-center">
              <p>
                {{
                  getdate(
                    `${task.startDate}`,
                    task.endDate ? `${task.endDate}` : undefined
                  ) + " sec"
                }}
              </p>
            </div>
          </li>
          <p v-if="tasks.size === 0" class="text-red-500">
            No History Log Exists
          </p>
        </ul>
      </div>
    </div>
  </div>
</template>
