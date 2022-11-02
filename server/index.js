const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

require('dotenv').config()
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')


const connectDB = async () => {
    try{
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mern-learnit.nu2i0wz.mongodb.net/?retryWrites=true&w=majority`, 
        { 
            useNewUrlParser:true,
            useUnifiedTopology: true,
        })

        console.log('MongoDb connected');
    }catch(e){
        console.log(e);
        process.exit(1)
    }
}

connectDB()

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)
//app.get('/', (req, res) => res.send('Hello World'))
//app.get('/', (req, res) => res.send('Hello World'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started ${PORT}` ))