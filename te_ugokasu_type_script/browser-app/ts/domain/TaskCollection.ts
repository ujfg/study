import { Status, Task, TaskObject } from "./Task";

export interface TaskCollectionRepository {
  fetch(): TaskCollection
  save(taskCollection: TaskCollection): void
}

export class TaskCollection {
  private tasks: Task[] = []

  private constructor(tasks: Task[]) {
    this.tasks = tasks
  }

  // DBからの再構成時のみ使用
  static reconstruct(taskParameters: any) {
    assertIsTaskObjects(taskParameters)

    const tasks = taskParameters.map(taskParameter => new Task(taskParameter))
    return new TaskCollection(tasks)
  }

  getTasks() {
    return this.tasks
  }

  add(task: Task) {
    this.tasks.push(task)
  }

  remove(tasks: Task[]) {
    const taskIds = tasks.map((task) => { return task.id })
    this.tasks = this.tasks.filter(({ id }) => !taskIds.includes(id))
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
  
  moveAboveTarget(task: Task, target: Task) {
    const taskIndex = this.tasks.indexOf(task)
    const targetIndex = this.tasks.indexOf(target)

    this.changeOrder(task, taskIndex, taskIndex < targetIndex ? targetIndex - 1 : targetIndex)
  }

  moveToLast(task: Task) {
    const taskIndex = this.tasks.indexOf(task)

    this.changeOrder(task, taskIndex, this.tasks.length)
  }

  private changeOrder(task: Task, taskIndex: number, targetIndex: number) {
    this.tasks.splice(taskIndex, 1)
    this.tasks.splice(targetIndex, 0, task)
  }
}

function assertIsTaskObjects(value: any): asserts value is TaskObject[] {
  if (!Array.isArray(value) || !value.every(item => Task.validate(item))) {
    throw new Error(`引数${value}は TaskObject[]型と一致しません。`)
  }
}