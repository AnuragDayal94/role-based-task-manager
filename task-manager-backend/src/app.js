const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);


const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
// app.get('/users/create', (req, res) => {
//   res.send('User creation page');
// });
app.get('/',(req,res)=>{
    res.send('Task manager api is running');
});

module.exports=app;