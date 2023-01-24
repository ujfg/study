import { EventListener } from "./EventListener"
import { Status, Task } from "./Task"
import { TaskCollection } from "./TaskCollection"
import { TaskRenderer } from "./TaskRenderer"

class Application {
  private readonly eventListner = new EventListener()
  private readonly taskCollection = new TaskCollection()
  private readonly taskRenderer = new TaskRenderer(
    document.getElementById('todoList') as HTMLElement,
    document.getElementById('doingList') as HTMLElement,
    document.getElementById('doneList') as HTMLElement,
  )
  
  start() {
    const createForm = document.getElementById('createForm') as HTMLElement

    this.eventListner.add('submit-handler', 'submit', createForm, this.handleSubmit.bind(this))
    this.taskRenderer.subscribeDragAndDrop(this.handleDrogAndDrop.bind(this))
  }

  private handleSubmit(e: Event):void {
    e.preventDefault()

    const titleInput = document.getElementById('title') as HTMLInputElement

    if (!titleInput.value) return

    const task = new Task({ title: titleInput.value })
    this.taskCollection.add(task)
    const { deleteButtonEl } = this.taskRenderer.append(task)

    this.eventListner.add(
      task.id,
      'click',
      deleteButtonEl,
      () => this.handleClickDeleteTask(task),
    )

    titleInput.value = ''
  }

  private handleClickDeleteTask(task: Task):void {
    if (!window.confirm(`${task.title}を削除してよろしいですか？`)) return

    this.eventListner.remove(task.id)
    this.taskCollection.remove(task)
    this.taskRenderer.remove(task)
  }

  private handleDrogAndDrop(el: Element, sibling: Element | null, newStatus: Status) {
    const taskId = this.taskRenderer.getId(el)
    if (!taskId) return

    const task = this.taskCollection.find(taskId)
    
    if (!task) return

    task.update({ status: newStatus })
    this.taskCollection.update(task)

    console.log(sibling)
  }
}

window.addEventListener('load', () => {
  const app = new Application()
  app.start()
})