const {open} = require('sqlite');
const sqlite = require('sqlite3');
const express = require('express');
const app = express();
const path = require('path')
const jwtToken = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const cors = require('cors')

//middlewares
app.use(express.json());
app.use(cors({origin:'*'}));

let db = null;
let dbPath = path.join(__dirname,'clawtodo.db');

let connectDb = async()=>{
    try{ 
     db = await open({
            filename: dbPath,
            driver: sqlite.Database
        }) 
        console.log('Db connected')
        app.listen(process.env.PORT,()=> console.log('Server running at '+process.env.PORT))

    } catch (error) {
       console.log(error)
       process.exit(1) 
    }
}
connectDb()
//middleware for check athurised user or not
const middleware = async (req,res,next)=>{
    try {
        const {token} = req.headers
        const varifying = jwtToken.verify(token,'mbs_token')
        // const {user_id,description,status=false} = req.body
        const query = `select id from users where username like '${varifying.userName}';`;
        const getUserId = await db.get(query);
        const user_id = getUserId.id
        req.body = {...req.body,user_id}
        next()
    } catch (error) {
        res.status(401).send("Unathurised User "+error)
    }
}
//  get all todos
app.get('/todos',middleware,async(req,res)=>{
    try {
        const {user_id} = req.body
        const query = `select * from todoitems where user_id = ${user_id}`;
        const data = await db.all(query)
        res.status(200).send(data)
    } catch (error) {
        res.status(500).send('internal error')
        console.log(error)
    }
}) 
// register
app.post('/register',async(req,res)=>{
    try {
        const {username,password} = req.body;
        const query = `select * from users where username like '${username}';`;
        const isExist = await db.get(query)
        if(!isExist && password.length > 3){
            const hashPass = await bcrypt.hash(password,8)
            const insertQuery = `INSERT INTO users(username,password) VALUES ('${username}','${hashPass}');`;
            const insertRes = await db.run(insertQuery)
           return res.status(201).send("Registered Successfully")
        }
        res.status(400).send('Username already exist please login now')
    } catch (error) {
        res.status(400).send('Register Failed')
    }
})
// login
app.post('/login',async(req,res)=>{
    try {
        const {username,password} = req.body
        const query = `select * from users where username like '${username}';`;
        const retriveUser = await db.get(query)
        if(retriveUser){
            const passCompare = await bcrypt.compare(password,retriveUser.password)
            if(passCompare){
                const token = jwtToken.sign({userName:username},'mbs_token',{ expiresIn: '24h' })
                return res.status(200).send({token})
            }else{
                return res.status(400).send("Invalid password")
            }
        }
        res.status(400).send("Invalid Credintials Please Enter Valid Details")
    } catch (error) {
        res.status(500).send('Login failed'+error)
    }
})
// insert new todos
app.post('/todos',middleware,async(req,res)=>{
    try {
        const {user_id,description,status=false} =  req.body
        const insertNewTodo = `INSERT INTO todoitems(user_id,description,status) VALUES (${user_id},'${description}','${status}');`;
        const addTodo = await db.run(insertNewTodo)
        console.log(addTodo)
        res.status(200).send('New todo added successfully')
    } catch (error) {
        res.status(400).send('Adding new todo failed'+error)
    }
})
// delete todo 
app.delete('/todos/:id',async(req,res)=>{
    try {
        const {id} = req.params
        const todoDelete = `delete from todoitems where id = ${id};`;
        const runDelete = await db.run(todoDelete)
        res.status(200).send('Todo deleted successfully')
    } catch (error) {
        res.status(400).send('Delete todo failed'+error)
    }
})
// update todo
app.put('/todos/:id',async(req,res)=>{
    try {
        const {id} = req.params
        const {description,status} = req.body
        const todoUpdate = `update todoitems set description='${description}',status='${status}' where id = ${id};`;
        const runDelete = await db.run(todoUpdate)
        res.status(200).send('Todo updated successfully')
    } catch (error) {
        res.status(400).send('Updating todo failed'+error)
    }
})