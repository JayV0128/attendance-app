const router = require('express').Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/log', attendanceController.logAttendance);
router.get('/logs', attendanceController.getAllLogs);

module.exports = router;