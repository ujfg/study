import { Status, Task, TaskObject } from "./Task";

const STORAGE_KEY = 'TASKS'

export class TaskCollection {
  private readonly storage
  private tasks: Task[] = []

  constructor() {
    this.storage = localStorage 
    this.tasks = this.getStoredTasks()
  }

  add(task: Task) {
    this.tasks.push(task)
    this.updateStrage()
  }

  remove(tasks: Task[]) {
    const taskIds = tasks.map((task) => { return task.id })
    this.tasks = this.tasks.filter(({ id }) => !taskIds.includes(id))
    this.updateStrage()
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
    this.updateStrage()
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
    this.updateStrage()
  }

  private updateStrage() {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(this.tasks))
  }

  private getStoredTasks() {
    const jsonString = this.storage.getItem(STORAGE_KEY)
    if (!jsonString) return [] 

    try {
      const storedTasks = JSON.parse(jsonString)

      assertIsTaskObjects(storedTasks)

      return storedTasks.map(task => new Task(task))
    } catch {
      this.storage.removeItem(STORAGE_KEY)
      return []
    }
  }
}

function assertIsTaskObjects(value: any): asserts value is TaskObject[] {
  if (!Array.isArray(value) || !value.every(item => Task.validate(item))) {
    throw new Error(`引数${value}は TaskObject[]型と一致しません。`)
  }
}