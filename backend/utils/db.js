import dotenv from 'dotenv'
dotenv.config()
import chalk from 'chalk'
import mongoose from 'mongoose'
import keys from '../config/keys.js'
const {database} = keys

 const setupDB = async () =>{
   
    try {
        mongoose.connect(database.url,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(()=>{
            console.log(`${chalk.green('✓')} ${chalk.blue('MongoDB Connected!')}`)
        })
    } catch (error) {
        console.log("error----", error)
    }
}   

export default setupDB