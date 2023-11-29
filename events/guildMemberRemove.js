const { Events, EmbedBuilder } = require('discord.js');
const channelId = '1165065277155848284'
module.exports = {
    name: Events.GuildMemberRemove,
    once: false,
    execute(client, member) {
        const channel = client.channels.cache.get(channelId);
        const now = new Date()

        const newMemberEmbed =  new EmbedBuilder()
        .setTitle('Un membre vient de quitter')
        .setDescription(
            `**Username**: ${member.displayName}\n
             **Membre depuis**: <t:${parseInt(member.user.joinedTimestamp / 1000)}:R>\n
             **Discord ID**:  ${member.user.id}\n
             `
        )
        .setColor('Red')
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()

        channel.send({embeds: [newMemberEmbed]});
    },
};