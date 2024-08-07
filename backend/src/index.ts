import { Hono } from 'hono'

const app = new Hono()

app.post('/api/v1/signup',(c) => {
  return c.text('hello')
})

app.post('/api/v1/signin',(c) => {
  return c.text('hello')
})

app.post('/api/v1/blog',(c) => {
  return c.text('hello')
})

app.put('/api/v1/blog',(c) => {
  return c.text('hello')
})

app.get('/api/v1/blog/:id',(c) => {
  return c.text('hello')
})



export default app
