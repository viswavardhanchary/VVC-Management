const express = require('express');
const app = express();
const cors = require('cors');
const connectionDB = require('./config/database');
const userRouter = require('./routers/user.router');
const projectRouter = require('./routers/project.router');



require('dotenv').config();
connectionDB();
app.use(cors({
  origin: ['http://localhost:5173']
}));

app.use(express.json());
app.use('/users' , userRouter);
app.use('/projects' , projectRouter);
app.get("/" , (req,res)=> {
  res.send("Hello");
});

const PORT = process.env.PORT

app.listen(PORT , ()=> {
  console.log(`Server Started at http://localhost:${PORT}`);
});