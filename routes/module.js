// routes/modules.js
const client = require('../index');
const express = require('express');
const router = express.Router();

// Import necessary models or functions
const Module = require('../models/module');
const fivemModel = require('../models/fivemServer');

// POST route to activate a module
router.post('/activate/:moduleId/:guildId', async (req, res) => {
    const { moduleId, guildId } = req.params; // Assuming moduleId is provided in the request body
    try {
        const module = await Module.findOneAndUpdate({name: moduleId, guild: guildId}, { active: true }, { new: true });
        // Handle success response
        res.status(200).json({ success: true, message: 'Module activated successfully', module });
    } catch (error) {
        // Handle error response
        console.error('Error activating module:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// POST route to deactivate a module
router.post('/deactivate/:moduleId/:guildId', async (req, res) => {
    const { moduleId, guildId } = req.params; // Assuming moduleId is provided in the request params
    try {
        const module = await Module.findOneAndUpdate({ name: moduleId, guild: guildId }, { active: false }, { new: true });
        if (module) {
            // Module found and updated successfully
            res.status(200).json({ success: true, message: 'Module deactivated successfully', module });
        } else {
            // Module not found
            res.status(404).json({ success: false, message: 'Module not found' });
        }
    } catch (error) {
        // Handle error response
        console.error('Error deactivating module:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.get('/getmodules/:guildId', async (req, res) => {
    try {
        const { guildId } = req.params;
        const modules = await Module.find({guild: guildId});
        // Handle success response
        res.status(200).json({ success: true, modules });
    } catch (error) {
        // Handle error response
        console.log('Error fetching modules:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.get('/getcommands/:guildId/:moduleName', async (req, res) => {
    try {
        const { guildId, moduleName } = req.params;
        const modules = await Module.find({ guild: guildId, module: moduleName });
        // Handle success response
        res.status(200).json({ success: true, modules });
    } catch (error) {
        // Handle error response
        console.log('Error fetching modules:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.post('/updateServer/:guildId/ip', async (req, res) => {
    try {
        const { guildId } = req.params;
        const { ip, port } = req.query;
        
        // Call the function to update IP and port
        const existingServer = await fivemModel.findOne({guild: guildId});
    
        if(existingServer){
            existingServer.ip = ip;
            existingServer.port = port;
            await existingServer.save();

            res.status(200).json({ success: true, message: 'Server IP and port updated successfully' });
    
        }else {
            const newServer = new fivemModel();
            newServer.ip = ip;
            newServer.port = port;
            newServer.guild = guildId;
            await newServer.save();

            res.status(200).json({ success: true, message: 'Server IP and port updated successfully' });
    
        }
        
    } catch (error) {
        // Handle error response
        console.error('Error updating server IP and port:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.post('/updateServer/:guildId/vote', async (req, res) => {
    try {
        const { guildId } = req.params;
        const { url } = req.query;
        
        // Call the function to update IP and port
        const existingServer = await fivemModel.findOne({guild: guildId});
    
        if(existingServer){
            existingServer.voteURL = url;
            await existingServer.save();

            res.status(200).json({ success: true, message: 'Server vote URL updated successfully' });
    
        }else {
            const newServer = new fivemModel();
            newServer.ip = 'Not Set';
            newServer.port = 'Not Set';
            newServer.voteURL = url;
            newServer.guild = guildId;
            await newServer.save();

            res.status(200).json({ success: true, message: 'Server vote URL updated successfully' });
    
        }
        
    } catch (error) {
        // Handle error response
        res.status(500).json({ success: false, message: 'Internal server error' });
        
    }
});

router.post('/updateServer/:guildId/server', async (req, res) => {
    try {
        const { guildId } = req.params;
        const { ip, port, url } = req.query;
        
        // Call the function to update IP and port
        const existingServer = await fivemModel.findOne({guild: guildId});
    
        if(existingServer){
            existingServer.ip = ip;
            existingServer.port = port;
            existingServer.voteURL = url;
            await existingServer.save();

            res.status(200).json({ success: true, message: 'Server updated successfully' });
    
        }else {
            const newServer = new fivemModel();
            newServer.ip = ip;
            newServer.port = port;
            newServer.voteURL = url;
            newServer.guild = guildId;
            await newServer.save();

            res.status(200).json({ success: true, message: 'Server updated successfully' });
    
        }
        
    } catch (error) {
        // Handle error response
        res.status(500).json({ success: false, message: 'Internal server error' });
        
    }
});

module.exports = router;
