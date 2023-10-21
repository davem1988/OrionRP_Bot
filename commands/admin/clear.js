const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Ip Du Serveur')
        .addNumberOption(option => 
            option
            .setName('nombre')
            .setDescription('Le nombre de messages à suprimer')
            .setRequired(true))
        .addUserOption(option =>
			option
				.setName('member')
				.setDescription('Le membre pour lequel vous voulez suprimer des messages')
				.setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
    usage: '/clear 10 || /clear @Dedemg1988 10',
    async execute(interaction) {
        const { channel, options } = interaction;
        const Amount = options.getNumber("nombre");
        const Target = options.getUser("member");

        const Response = new EmbedBuilder()
        .setColor('LuminousVividPink');

        if (Target) {
            // Fetch and filter messages from the channel sent by the target user
            const messages = await channel.messages.fetch();
            const filteredMessages = messages.filter((message) => message.author.id === Target.id);
            // Delete the filtered messages
            if (Amount > 0) {
                let i = 0
                
                
                filteredMessages.forEach(messageToDelete => {
                    if (i < Amount) {
                        console.log(i)
                        messageToDelete.delete()
                        i++
                    }
                })
                
                Response.setDescription(`🧹 Cleared ${Amount} messages from ${Target}.`);
            }
        } else {
            // Fetch and delete messages from the channel directly
            await channel.bulkDelete(Amount, true).then((deletedMessages) => {
                Response.setDescription(`🧹 Cleared ${deletedMessages.size} messages from this channel.`);
            });
        }

        interaction.reply({ embeds: [Response] }).then(() => {
            setTimeout(() => interaction.deleteReply(), 10000);
        }).catch(console.error);
    }
};