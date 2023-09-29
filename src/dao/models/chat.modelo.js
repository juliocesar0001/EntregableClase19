const mongoose = require("mongoose")


const messagesCollection = "messages"
const messagesSchema = new mongoose.Schema({

   message: {
      type: String,
      require: true,
   },

   user: {
      type: String,
      require: true,
   }
},{collection:'messages'})

const messageModelo = mongoose.model(messagesCollection, messagesSchema)

module.exports = messageModelo