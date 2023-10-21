const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Repond par Pong!'),
        usage: '/ping',
    async execute(interaction) {
        const pingEmbed = new EmbedBuilder()
        .setTitle('Commande: /ping')
        .setColor('Yellow')
        .setDescription('Pong')
        .setTimestamp()
        .setAuthor({ name: `${interaction.client.user.username}`})

        
        return await interaction.reply({embeds: [pingEmbed]});
    }
};