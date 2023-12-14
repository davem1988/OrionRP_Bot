const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Voter pour le Top-Serveur'),
    usage: '/vote',
    async execute(interaction) {


        const ipEmbed = new EmbedBuilder()
        .setTitle('Commande: /vote')
        .setColor('Yellow')
        .setDescription("@everyone Hey! Il est l'heure de voter pour le serveur afin d'avoir une meilleure visibilité. \n\nVoici le lien du serveur: \n\nhttps://top-serveurs.net/gta/orion-rp-655d19489d908")
        .setTimestamp()
        .setAuthor({ name: `${interaction.client.user.username}`})

        
        return await interaction.reply({embeds: [ipEmbed]});
    }
};
