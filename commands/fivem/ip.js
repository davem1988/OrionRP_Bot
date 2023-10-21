const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ip')
        .setDescription('Ip Du Serveur'),
    usage: '/ip',
    async execute(interaction) {
        const ipEmbed = new EmbedBuilder()
        .setTitle('Commande: /ip')
        .setColor('Yellow')
        .setDescription('Pour vous connecter avec le IP appuyer sur F8 lorsque FiveM est ouvert et entrer la commande: \n\nconnect 23.26.224.7:30161')
        .setTimestamp()
        .setAuthor({ name: `${interaction.client.user.username}`})

        
        return await interaction.reply({embeds: [ipEmbed]});
    }
};