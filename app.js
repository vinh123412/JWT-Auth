require('dotenv').config();
require('express-async-errors');
require('./db/connect')
const express = require('express');
const app = express();

const authenticateUser = require('./middleware/authentication')

//Routers
const authRouter = require('./routes/auth')
const jobRouter = require('./routes/jobs')
const tokenRouter = require('./routes/token')


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
app.use(express.static('./public'));
// extra packages

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobRouter)
app.use('/api/v1/getToken', tokenRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
