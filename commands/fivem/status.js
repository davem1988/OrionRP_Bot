const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Voir le status du serveur'),
    usage: '/ip',
    async execute(interaction) {
        const StatusEmbed = new EmbedBuilder()
        .setTitle('Commande: /status')
        .setColor('Red')
        .setDescription('Le serveur est MORT à cause de Rene!!!')
        .setTimestamp()
        .setAuthor({ name: `${interaction.client.user.username}`})

        
        return await interaction.reply({embeds: [StatusEmbed]});
    }
};