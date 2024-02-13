import app from './app'

let port = process.env.PORT
if (port === undefined || port === '') {
  port = '3000'
}

app
  .listen(port, () => {
    console.log(`🦭 ERP is runnung on  http://localhost:${port}`)
  })
  .on('error', (error) => {
    console.error(error)
    process.exit(1)
  })
