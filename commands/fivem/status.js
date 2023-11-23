const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
require('dotenv').config();
const FiveM = require("fivem");
const path = require('path');
const IP = process.env.SERVER_IP;
const PORT = process.env.SERVER_PORT;
const serverLogo = new AttachmentBuilder(path.join(__dirname, '../../files/welcome.gif'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Voir le status du serveur'),
    usage: '/ip',
    async execute(interaction) {
        const server = new FiveM.Server(`${IP}:${PORT}`);
        
        // Defer the initial reply
        await interaction.deferReply();

        const StatusEmbed = {
            title: 'Status du Serveur',
            color: 0x0099ff,
            description: 'Status actuel du serveur',
            image: { url: 'attachment://welcome.gif' },
            timestamp: new Date(),
            author: { name: interaction.client.user.username },
            fields: [],
        };

        // Function to update the status
        const updateStatus = async () => {
            try {
                const state = await server.getServerStatus();
                const playersNumber = await server.getPlayers();
                const status = state.online;

                StatusEmbed.fields = []; // Clear existing fields

                if (status === false) {
                    StatusEmbed.fields.push(
                        { name: 'Online:   🔴', value: '\n\n ' },
                    );
                } else if (status === true) {
                    StatusEmbed.fields.push(
                        { name: 'Online:   🟢', value: '\n\n ' },
                    );
                }

                StatusEmbed.fields.push(
                    { name: 'Connection: ', value: 'Pour vous connecter via IP ouvrez FiveM,\n appuyez sur F8 puis entrez la commande suivante\n incluant "connect".\n\n```connect 88.198.53.38:27805```' },
                    { name: 'Actuellement en ligne: ', value:  `\`\`${playersNumber} Joueurs\`\``}
                );

                // Edit the deferred reply
                await interaction.editReply({ embeds: [StatusEmbed], files: [serverLogo] });
            } catch (error) {
                // Handle the timeout error
                console.error('Error updating status:', error.message);
                StatusEmbed.fields = [
                    { name: 'Online:   🔴', value: '\n\n ' },
                    { name: 'Connection: ', value: 'Serveur inaccessible pour le moment.' },
                ];
                await interaction.editReply({ embeds: [StatusEmbed], files: [serverLogo] });
            }
        };

        // Call the function to update the status immediately
        await updateStatus();

        // Set an interval to update the status every 5 minutes (adjust as needed)
        const updateInterval = setInterval(updateStatus, 30 * 1000);

        // Make sure to clear the interval when the command is no longer active (e.g., if the bot restarts)
        interaction.client.once('interactionCreate', () => clearInterval(updateInterval));
    }
};




