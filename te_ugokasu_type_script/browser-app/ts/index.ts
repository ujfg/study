import { EventListener } from "./EventListener"
import { Status, statusMap, Task } from "./domain/Task"
import { TaskRenderer } from "./presentation/TaskRenderer"
import { TaskCollectionLocalStorageRepository } from "./infra/TaskCollectionRepository"

class Application {
  private readonly eventListner = new EventListener()
  private readonly taskCollectionRepository = new TaskCollectionLocalStorageRepository()
  private readonly taskCollection = this.taskCollectionRepository.fetch()
  private readonly taskRenderer = new TaskRenderer(
    document.getElementById('todoList') as HTMLElement,
    document.getElementById('doingList') as HTMLElement,
    document.getElementById('doneList') as HTMLElement,
  )
  
  start() {
    const taskItems = this.taskRenderer.renderAll(this.taskCollection)
    const createForm = document.getElementById('createForm') as HTMLElement
    const deleteAllDoneButton = document.getElementById('deleteAllDoneTask') as HTMLElement

    taskItems.forEach(({ task, deleteButtonEl }) => {
      this.eventListner.add(
        'click',
        deleteButtonEl,
        () => this.handleClickDeleteTask(task),
        task.id,
      )
    })

    this.eventListner.add('submit', createForm, this.handleSubmit.bind(this))
    this.eventListner.add('click', deleteAllDoneButton, this.handleClickDeleteAllDoneTasks.bind(this))
    this.taskRenderer.subscribeDragAndDrop(this.handleDrogAndDrop.bind(this))
  }

  private handleSubmit(e: Event):void {
    e.preventDefault()

    const titleInput = document.getElementById('title') as HTMLInputElement

    if (!titleInput.value) return

    const task = new Task({ title: titleInput.value })
    this.taskCollection.add(task)
    this.taskCollectionRepository.save(this.taskCollection)
    const { deleteButtonEl } = this.taskRenderer.append(task)

    this.eventListner.add(
      'click',
      deleteButtonEl,
      () => this.handleClickDeleteTask(task),
    )

    titleInput.value = ''
  }

  private handleClickDeleteTask(task: Task):void {
    if (!window.confirm(`${task.title}???????????????????????????????????????`)) return

    this.eventListner.remove(task.id)
    this.taskCollection.remove([task])
    this.taskCollectionRepository.save(this.taskCollection)
    this.taskRenderer.remove([task])
  }

  private handleClickDeleteAllDoneTasks(): void {
    if (!window.confirm('DONE ?????????????????????????????????????????????????????????')) return

    const doneTasks = this.taskCollection.filterByStatus(statusMap.done)
    this.taskCollection.remove(doneTasks)
    this.taskCollectionRepository.save(this.taskCollection)
    this.taskRenderer.remove(doneTasks)
  }

  private handleDrogAndDrop(el: Element, sibling: Element | null, newStatus: Status) {
    const taskId = this.taskRenderer.getId(el)
    if (!taskId) return

    const task = this.taskCollection.find(taskId)
    
    if (!task) return

    task.update({ status: newStatus })
    this.taskCollection.update(task)

    if (sibling) {
      const nextTaskId = this.taskRenderer.getId(sibling)

      if (!nextTaskId) return

      const nextTask = this.taskCollection.find(nextTaskId)

      if (!nextTask) return

      this.taskCollection.moveAboveTarget(task, nextTask)
    } else {
      this.taskCollection.moveToLast(task)
    }

    this.taskCollectionRepository.save(this.taskCollection)
  }
}

window.addEventListener('load', () => {
  const app = new Application()
  app.start()
})