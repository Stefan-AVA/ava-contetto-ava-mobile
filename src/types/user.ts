type Email = {
  email: string
  primary: boolean
  verified: boolean
}

export interface User {
  _id: string
  name: string
  emails: Email[]
  deleted: boolean
  username: string
  verified: boolean
  createdAt: number
  updatedAt: number
  verificationCode: string
}
