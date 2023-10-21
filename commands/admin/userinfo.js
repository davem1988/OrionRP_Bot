const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('userinfo')
        .setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    usage: 'Clique droit sur un membre -> Apps -> userinfo',
    description: 'Obtenir des informations sur un membre.',
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            // If the user doesn't have the required permission, send an error message
            interaction.reply({ content: 'You do not have the required permissions to use this command.', ephemeral: true });
            return;
        }
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