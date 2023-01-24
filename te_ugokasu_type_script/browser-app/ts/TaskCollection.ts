import { Status, Task } from "./Task";

export class TaskCollection {
  private tasks: Task[] = []

  add(task: Task) {
    this.tasks.push(task)
  }

  remove(tasks: Task[]) {
    const taskIds = tasks.map((task) => task.id)
    this.tasks = this.tasks.filter(({ id }) => {
      !taskIds.includes(id)
    })
  }

  find(id: string) {
    return this.tasks.find((task) => task.id === id)
  }

  filterByStatus(filterStatus: Status) {
    return this.tasks.filter(({ status }) => status === filterStatus )
  }

  update(task: Task) {
    this.tasks = this.tasks.map((item) => {
      if (item.id === task.id) return task
      return item
    })
  }
}