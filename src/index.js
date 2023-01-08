const express = require('express')

const { v4: uuid } = require('uuid')

const app = express()

app.use(express.json())

const repositories = []

app.get('/repositories', (request, response) => {
  return response.status(201).json(repositories)
})

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(repository)
  return response.json(repository)
})

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params
  const updateRepository = request.body

  const repositoryIndex = repositories.findindex(
    repository => repository.id === id
  )
  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' })
  }

  if (updateRepository.likes > 10) {
    return response
      .status(404)
      .json({ error: 'Dont more 10 likes', ...repositories[repositoryIndex] })
  }

  const repository = { ...repositories[repositoryIndex], ...updateRepository }

  repositories[repositoryIndex] = repository

  return response.json(repository)
})

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  )

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' })
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
})

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  )

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' })
  }

  repositories[repositoryIndex].likes++

  return response.json({ likes: repositories[repositoryIndex].likes })
})

module.exports = app
