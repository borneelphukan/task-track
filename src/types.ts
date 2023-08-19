import { Ref } from "vue";

export interface TodoItem {
  id: Date | number | string;
  taskName: string;
  completed?: boolean;
  startDate: Date | number | string;
  endDate?: Date | number | string;
  duration?: Date | number | string;
  runningTime?: Ref<string>;
}

export type TodoListState = "all" | "active" | "completed";
