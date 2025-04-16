const attendanceModel = require('../models/attendanceModel');
const userModel = require('../models/userModel');

module.exports = {
    logAttendance: async (req, res) => {
        const { token, method, deviceInfo } = req.body;

        try {
            // Validate token and extract user ID
            const user = await userModel.getUserByToken(token);
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const userId = user.id;
            const result = await attendanceModel.createLog(userId, method, deviceInfo);
            
            res.status(201).json({ message: 'Attendance logged successfully', logId: result.insertId });
        } catch (error) {
            console.error('Error logging attendance:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getAllLogs: async (req, res) => {
        try {
            const logs = await attendanceModel.getLogs();
            res.status(200).json(logs);
        } catch (error) {
            console.error('Error fetching logs:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}