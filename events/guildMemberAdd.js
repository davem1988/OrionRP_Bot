const { Events, EmbedBuilder } = require('discord.js');
const channelId = '1165065230578110594'
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
        .setTimestamp()

        /* const guild = member.guild
        const fondaRole = guild.roles.cache.find(role => role.name === 'Fondateurs')
        console.log(fondaRole)

        member.roles.add(fondaRole) */

        channel.send({embeds: [newMemberEmbed]});
    },
};