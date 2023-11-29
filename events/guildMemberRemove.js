const { Events, EmbedBuilder} = require('discord.js');
const channelId = '1165065277155848284'
module.exports = {
    name: Events.GuildMemberRemove,
    once: false,
    execute(client, member) {
        const channel = client.channels.cache.get(channelId);
        const now = new Date()
        const timeDifference = now - member.joinedAt;

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        const since = `${days} jours, ${hours} heures, ${minutes} minutes, and ${seconds} secondes`;

        const newMemberEmbed =  new EmbedBuilder()
        .setTitle('Un membre vient de quitter')
        .setDescription(
            `**Username**: ${member.displayName}\n
            **Membre depuis**: ${since}\n
            **Discord ID**:  ${member.user.id}\n
            `
        )
        .setColor('Red')
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()


        channel.send({embeds: [newMemberEmbed]});
    },
};