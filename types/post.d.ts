declare interface Post {
  id: number
  userId: number
  title: string
  body: string
}
declare interface PostComment {
  id: number
  postId: number
  name: string
  email: string
  body: string
}
