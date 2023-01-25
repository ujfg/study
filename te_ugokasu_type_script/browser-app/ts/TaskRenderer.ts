import dragula from "dragula";

import { Status, statusMap, Task } from "./Task";
import { TaskCollection } from "./TaskCollection";

export class TaskRenderer {
  constructor(
    private readonly todoList: HTMLElement,
    private readonly doingList: HTMLElement,
    private readonly doneList: HTMLElement,
  ) {}

  renderAll(taskCollection: TaskCollection) {
    const todoTasks = this.renderList(taskCollection.filterByStatus(statusMap.todo), this.todoList)
    const doingTasks = this.renderList(taskCollection.filterByStatus(statusMap.doing), this.doingList)
    const doneTasks = this.renderList(taskCollection.filterByStatus(statusMap.done), this.doneList)

    return [...todoTasks, ...doingTasks, ...doneTasks]
  }

  append(task: Task) {
    const { taskEl, deleteButtonEl } = this.render(task)

    this.todoList.append(taskEl)
    return { deleteButtonEl }
  }

  remove(tasks: Task[]) {
    tasks.forEach((task) => {
      const taskEl = document.getElementById(task.id)
      if (!taskEl) return
  
      let list
      switch (task.status) {
        case statusMap.todo:
          list = this.todoList
          break
        case statusMap.doing:
          list = this.doingList
          break
        case statusMap.done:
          list = this.doneList
          break
      }
      list.removeChild(taskEl)
    })
  }

  subscribeDragAndDrop(onDrop: (el: Element, sibling: Element | null, newStatus: Status) => void) {
    dragula([this.todoList, this.doingList, this.doneList]).on('drop', (el, target, _source, sibling) => {
      let newStatus: Status = statusMap.todo

      if (target.id === 'doingList') newStatus = statusMap.doing
      if (target.id === 'doneList') newStatus = statusMap.done

      onDrop(el, sibling, newStatus)
    })
  }

  getId(el: Element) {
    return el.id
  }

  private render(task: Task) {
    // <div class="task-item" id="task.id">
    //   <span>タイトル</span>
    //   <button>削除</button>
    // <div>
    const taskEl = document.createElement('div')
    const spanEl = document.createElement('span')
    const deleteButtonEl = document.createElement('button')

    taskEl.id = task.id
    taskEl.classList.add('task-item')
    
    spanEl.textContent = task.title
    deleteButtonEl.textContent = '削除'

    taskEl.append(spanEl, deleteButtonEl)

    return { taskEl, deleteButtonEl }
  }

  private renderList(tasks: Task[], listEl: HTMLElement) {
    if (tasks.length === 0) return []

    const taskList: {
      task: Task,
      deleteButtonEl: HTMLButtonElement,
    }[] = []

    tasks.forEach((task) => {
      const { taskEl, deleteButtonEl } = this.render(task)

      listEl.append(taskEl)
      taskList.push({ task, deleteButtonEl })
    })

    return taskList
  }
}