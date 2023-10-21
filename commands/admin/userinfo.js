const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('userinfo')
        .setType(ApplicationCommandType.User),
    usage: '/ip',
    async execute(interaction) {
        const target = await interaction.guild.members.fetch(interaction.targetId);

        const Response = new EmbedBuilder()
        .setColor('Aqua')
        .setAuthor({name: target.user.tag, avataURL: target.user.avatarURL({dynamic: true, size: 512})})
        .setThumbnail(target.user.avatarURL({dynamic: true, size: 512}))
        .addFields({name: "Username", value: `${target.user.username}`})
        .addFields({name: "ID",value: `${target.user.id}`})
        .addFields({name: "Roles", value: `${target.roles.cache.map(r => r).join(" ").replace("@everyone", " ") || "None"}`})
        .addFields({name: "Member Since", value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, inline: true})
        .addFields({name: "Discord User Since", value: `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`, inline: true})

        interaction.reply({embeds: [Response], ephemeral: true})
    }
};