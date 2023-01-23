import { v4 as uuid } from 'uuid'

export const statusMap = {
  todo: 'TODO',
  doing: 'DOING',
  done: 'DONE',
} as const

type Status = typeof statusMap[keyof typeof statusMap]

export class Task {
  readonly id
  public title
  public status: Status

  constructor(propaties: { title: string }) {
    this.id = uuid()
    this.title = propaties.title
    this.status = statusMap.todo
  }
}