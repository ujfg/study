import { v4 as uuid, validate } from 'uuid'

export const statusMap = {
  todo: 'TODO',
  doing: 'DOING',
  done: 'DONE',
} as const

export type Status = typeof statusMap[keyof typeof statusMap]

export type TaskObject = {
  id: string
  title: string
  status: Status
}

export class Task {
  readonly id
  public title
  public status

  constructor(propaties: { id?: string, title: string, status?: Status }) {
    this.id = propaties.id || uuid()
    this.title = propaties.title
    this.status = propaties.status || statusMap.todo
  }

  static validate(value: any) {
    if (!value) return false
    if (!validate(value.id)) return false
    if (!value.title) return false
    if (!Object.values(statusMap).includes(value.status)) return false

    return true
  }

  update(properties: { title?: string, status?: Status }) {
    if (properties.title) this.title = properties.title
    if (properties.status) this.status = properties.status
  }
}