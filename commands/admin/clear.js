const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Ip Du Serveur')
        .addUserOption(option =>
			option
				.setName('member')
				.setDescription('Le membre pour lequel vous voulez suprimer des messages')
				.setRequired(false))
        .addNumberOption(option => 
            option
            .setName('nombre')
            .setDescritption('Le nombre de messages à suprimer')
            .setRequired(true)),
    usage: '/clear 10 || /clear @Dedemg1988 10',
    async execute(interaction) {
        const { channel, options } = interaction;
        const Amount = options.getNumber("amount");
        const Target = options.getMember("target");

        const Messages = await channel.messages.fetch();

        const Response = new EmbedBuilder()
        .setColor('LuminousVividPink');

        if(Target) {
            let i = 0;
            const filtered = [];
            (await Messages).filter((m) => {
                if(m.author.id === Target.id && Amount > i) {
                    filtered.push(m);
                    i++;
                }
            })

            await channel.bulkDelete(filtered, true).then(messages => {
                Response.setDescription(`🧹 Cleared ${messages.size} from ${Target}.`);
                interaction.messages.reply({embeds: [Response]}).then(
                setTimeout(() => interaction.deleteReply(), 10000))
                .catch(console.error);
            })
        } else {
            await channel.bulkDelete(Amount, true).then(messages => {
                Response.setDescription(`🧹 Cleared ${messages.size} from this channel.`);
                interaction.reply({embeds: [Response]}).then(
                setTimeout(() => interaction.deleteReply(), 10000))
                .catch(console.error);
            })
        }
    }
};