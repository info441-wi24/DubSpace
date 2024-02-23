import mongoose from 'mongoose'

let models = {}

console.log('connecting to mongodb')
await mongoose.connect("")
console.log('successfully connected to mongodb')

const postSchema = new mongoose.Schema({
  username: String,
  post: String,
  hashtag: String,
  likes: Number,
  date: Date
})

models.Post = mongoose.model('Post', postSchema)

export default models
