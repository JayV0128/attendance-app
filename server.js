const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

const userRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/attendance', attendanceRoutes);

app.get('/', (req, res) => {
    res.send('Attendance system server is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});