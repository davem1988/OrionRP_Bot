const fs = require('node:fs');
const path = require('node:path');
const client = require('../../index');
const smwModel = require('../../models/smwSystem');

module.exports = {
    name: '/getUserGuilds/:id/modules/smwsetup/config',
    run: async (req, res) => {
        delete require.cache[require.resolve('../html/smwsetup.ejs')];
        
        const guildId = req.params.id;
        const module = 'smwsetup';
        const guild = client.guilds.cache.get(guildId);
        const smwInfo = await smwModel.findOne({guildId: guildId});
        let questionsArray = {}
        let answersArray = {}
        let questionsAmount = 0

        if(smwInfo){
            questionsAmount = smwInfo.question_amount;
            questionsArray = smwInfo.questions[0];
            answersArray = smwInfo.answers[0];
        }

        let smwQAs = {
            questionAmount: questionsAmount,
            questions: questionsArray,
            answers: answersArray
        }
        

        let args = {
            module: module,
            guild: guild,
            smwQA: smwQAs
        }

        res.render('./dashboard/html/smwsetup.ejs', args);
    }
};