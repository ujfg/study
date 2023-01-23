import { Task } from "./Task";

export class TaskCollection {
  private tasks: Task[] = []

  add(task: Task) {
    this.tasks.push(task)
  }

  remove(task: Task) {
    this.tasks.filter(({ id }) => id !== task.id)
  }
}