const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
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