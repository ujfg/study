import { TaskCollection, TaskCollectionRepository } from "../domain/TaskCollection";

const STORAGE_KEY = 'TASKS'

export class TaskCollectionLocalStorageRepository implements TaskCollectionRepository {
  private readonly storage

  constructor() {
    this.storage = localStorage
  }

  fetch() {
    const jsonString = this.storage.getItem(STORAGE_KEY)
    if (!jsonString) return TaskCollection.reconstruct([]) 

    try {
      const storedTasks = JSON.parse(jsonString)

      return TaskCollection.reconstruct(storedTasks)
    } catch {
      this.storage.removeItem(STORAGE_KEY)
      return TaskCollection.reconstruct([])
    }
  }

  save(taskCollection: TaskCollection) {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(taskCollection.getTasks()))
  } 
}