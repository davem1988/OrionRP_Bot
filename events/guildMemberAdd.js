const { Events, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const channelId = '1165065230578110594'
const file = new AttachmentBuilder('../container/files/welcome.gif');
module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    execute(client, member) {
        const channel = client.channels.cache.get(channelId);
        const now = new Date()
        const since = `${now - member.user.createdAt * 1000 * 60 * 60 * 24 }`

        const newMemberEmbed =  new EmbedBuilder()
        .setTitle('Un nouveau membre vient de faire son arrivée')
        .setDescription(
            `**Username**: ${member.displayName}\n
             **Compte Discord créé**: <t:${parseInt(member.user.createdTimestamp / 1000)}:R>\n
             **Discord ID**:  ${member.user.id}\n
             `
        )
        .setColor('Blue')
        .setThumbnail(member.user.displayAvatarURL())
        .setImage('attachment://welcome.gif')
        .setTimestamp()

        const guild = member.guild
        const memberRole = guild.roles.cache.find(role => role.id === '1144611247233433601')

        member.roles.add(memberRole)

        channel.send({embeds: [newMemberEmbed], files: [file]});
    },
};