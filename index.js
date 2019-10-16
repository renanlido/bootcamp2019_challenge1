const express = require('express')
const server = express()

server.use(express.json())

let numOfRequests = 0
const projects= []

server.use((req, res, next)=> {
  numOfRequests++
  
  console.log(`Número de requisições: ${numOfRequests}`)

  next()
})

//Middleware checa se o projeto existe
function checkProjectExists(req, res, next) {
  const { id } = req.params
  const project = projects.find(p => p.id == id)

  if (!project) {
    return res.status('404').json({'error':'Project not found'})
  }

  return next()
}

//Middleware checa se a tarefa existe
function checkTaskExists(req, res, next) {
  const { id, idTask } = req.params
  const project = projects.find(p => p.id == id) 
  const task = project.tasks.find(t =>t.idTask == idTask)
  
  if (!task) {
    return res.status('404').json({'error':'Task not found'})
  }

  return next()
}

//project
server.get('/projects', (req,res)=>{
  return res.json(projects)
})

server.post('/projects',(req, res)=>{
  const { id, title } = req.body
  
  const project = {
    id,
    title,
    tasks: []
  }

  projects.push(project)

  return res.json(projects)
})

server.put('/projects/:id', checkProjectExists, (req, res)=>{
  const { id } = req.params
  const { title } = req.body

  const project = projects.find(p => p.id == id)  

  project.title = title

  return res.json(project)
})

server.delete('/projects/:id', checkProjectExists, (req, res)=>{
  const { id } = req.params

  const projectIndex = projects.findIndex(p => p.id == id)

  projects.splice(projectIndex,1)

  return res.send()
})

//tasks
server.post('/projects/:id/tasks', checkProjectExists, (req, res)=>{
  const { id } = req.params
  const {idTask, title} = req.body
  
  const task = {
    idTask,
    title
  }
   
  // const { task } = req.body

  const project = projects.find(p => p.id == id)

  project.tasks.push(task)

  return res.json(project);
})

server.put('/projects/:id/tasks/:idTask',checkProjectExists, checkTaskExists,(req, res)=>{
  const { id, idTask } = req.params
  const { title } = req.body

  const project = projects.find(p => p.id == id) 
  const tasks = project.tasks.find(t =>t.idTask == idTask)

  tasks.title = title

  return res.json(project)
})

server.delete('/projects/:id/tasks/:idTask' ,checkProjectExists, checkTaskExists, (req, res)=>{
  const { id, idTask } = req.params

  const project = projects.find(p => p.id == id)
  const task = project.tasks.findIndex(t =>t.idTask == idTask)

  project.tasks.splice(task, 1)

  return res.send()
})

server.listen('3000')