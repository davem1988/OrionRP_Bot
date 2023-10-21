const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const { readdirSync } = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Description des commandes et leurs usage'),
    usage: '/help',
    async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('helpPreviousPage')
                    .setLabel('Précédente')
                    .setStyle('Secondary')
                    .setEmoji('◀️'),
                new ButtonBuilder()
                    .setCustomId('helpNextPage')
                    .setLabel('Suivante')
                    .setStyle('Secondary')
                    .setEmoji('▶️')
            );

        const Commands = [];
        const chunkSize = 1;

        readdirSync('./commands').forEach((folder) => {
            readdirSync(`./commands/${folder}`).forEach((file) => {
                const command = require(`../../commands/${folder}/${file}`);
                if (command.data && command.execute) {
                    Commands.push(command);
                }
            });
        });

        const Embeds = [];
        const CommandsLength = Commands.length;

        for (let i = 0; i < CommandsLength; i += chunkSize) {
            const chunk = Commands.slice(i, i + chunkSize);
            const Response = new EmbedBuilder()
            .setColor('Greyple') // Replace with a valid color
            .setTitle(`Liste des commandes: (${Embeds.length + 1}/${Math.ceil(Commands.length / chunkSize)})`)
            .setDescription('Commande');

            chunk.forEach((ChunkCommand) => {
                const upperCaseName = ChunkCommand.data.name.charAt(0).toUpperCase() + ChunkCommand.data.name.slice(1);
                const hyphenLine = '- '.repeat(upperCaseName.length);
                Response.addFields({
                    name: `${upperCaseName}\n${hyphenLine}`,
                    value: `*Usage*: \`${ChunkCommand.usage || 'Usage not provided'}\`\n*Description*: ${ChunkCommand.data.description || ChunkCommand.description || 'Description not provided'}`,
                    inline: true
                });
            });

            Embeds.push(Response);
        }

        let page = 0;

        await interaction.reply({ embeds: [Embeds[page].toJSON()], components: [row.toJSON()] });

        const iFilter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter: iFilter, time: 60000*5 });

        collector.on('collect', async i => {
            if (i.customId === 'helpNextPage') {
                page++;
                if (page > Embeds.length - 1) {
                    page = 0;
                }
            } else if (i.customId === 'helpPreviousPage') {
                page--;
                if (page < 0) {
                    page = Embeds.length - 1;
                }
            }
            await i.update({ embeds: [Embeds[page].toJSON()], components: [row.toJSON()] });
        });

        collector.on('end', () => {
            row.components.forEach((button) => {
                button.setDisabled(true);
            });
            interaction.editReply({ embeds: [Embeds[page].toJSON()], components: [row.toJSON()] });
        });
    },
};