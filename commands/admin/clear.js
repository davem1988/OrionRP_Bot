const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Supprimer un nombre de messages ou supprimer un nombre de message pour un membre précis')
        .addNumberOption(option => 
            option
            .setName('nombre')
            .setDescription('Le nombre de messages à suprimer (Max 100)')
            .setMaxValue(100)
            .setRequired(true))
        .addUserOption(option =>
			option
				.setName('membre')
				.setDescription('Le membre pour lequel vous voulez suprimer des messages')
				.setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
    usage: '/clear 10 || /clear 10 @Dedemg1988',
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            // If the user doesn't have the required permission, send an error message
            interaction.reply({ content: 'You do not have the required permissions to use this command.', ephemeral: true });
            return;
        }
        const { channel, options } = interaction;
        const Amount = options.getNumber("nombre");
        const Target = options.getUser("membre");

        const Response = new EmbedBuilder()
        .setColor('LuminousVividPink');

        if (Target) {
            const messages = await channel.messages.fetch();
            const filteredMessages = messages.filter((message) => message.author.id === Target.id);
            if (Amount > 0) {
                let i = 0
                
                
                filteredMessages.forEach(messageToDelete => {
                    if (i < Amount) {
                        console.log(i)
                        messageToDelete.delete()
                        i++
                    }
                })
                
                if (Amount < filteredMessages){
                    Amount = filteredMessages.length
                }
                Response.setDescription(`🧹 Supprimé ${Amount} messages de ${Target}.`);
            }
        } else {
            await channel.bulkDelete(Amount, true).then((deletedMessages) => {
                Response.setDescription(`🧹 Supprimé ${deletedMessages.size} messages dans ce salon.`);
            });
        }

        interaction.reply({ embeds: [Response] }).then(() => {
            setTimeout(() => interaction.deleteReply(), 10000);
        }).catch(console.error);
    }
};