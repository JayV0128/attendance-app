const userModel = require('../models/userModel');

module.exports = {
    createUser: async (req, res) => {
        const { name, nfc_tag_id, qr_code_id } = req.body;

        try {
            // Validate token and extract user ID
            const user = await userModel.createUser(name, nfc_tag_id, qr_code_id);
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            console.log('User: ', JSON.stringify(user, null, 4));
            
            res.status(201).json({ message: 'User registered successfully', userId: user.insertId });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
}