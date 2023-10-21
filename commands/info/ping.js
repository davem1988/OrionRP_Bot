const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Repond par Pong!'),
        usage: '/ping',
    async execute(interaction) {
        const pingEmbed = new EmbedBuilder()
        .setTitle('Commande: /ping 🏓')
        .setColor('Yellow')
        .setDescription("Calculating ping...")
        .setTimestamp()
        .setAuthor({ name: `${interaction.client.user.username}`})

        
        const initialMessage = await interaction.reply({ embeds: [pingEmbed]});
        const ping = initialMessage.createdTimestamp - interaction.createdTimestamp;

        // Update the initial message with the calculated ping
        pingEmbed.setDescription(`Bot Latency: ${ping}ms\nAPI Latency: ${interaction.client.ws.ping}ms`);
        initialMessage.edit({ embeds: [pingEmbed]});
    }
};