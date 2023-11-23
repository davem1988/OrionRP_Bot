const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
require('dotenv').config();
const FiveM = require("fivem")
const IP = process.env.SERVER_IP
const PORT = process.env.SERVER_PORT

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Voir le status du serveur'),
    usage: '/ip',
    async execute(interaction) {
        const server = new FiveM.Server(`${IP}:${PORT}`)

        const StatusEmbed = new EmbedBuilder()
        .setTitle('Status du Serveur')
        .setColor('Blue')
        .setDescription('Status actuel du serveur')
        .setTimestamp()
        .setAuthor({ name: `${interaction.client.user.username}`})

        server.getServerStatus().then(status => {
            console.log(status)
        })



        
        return await interaction.reply({embeds: [StatusEmbed]});
    }
};