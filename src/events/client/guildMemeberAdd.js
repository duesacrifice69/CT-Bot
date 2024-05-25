const { Events } = require("discord.js");

module.exports = {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member, client) {
    let channel = client.channels.cache.get(client.config.logChannel);
    channel.send({
      content: `Welcome ${member.user.username} to ${guild.name}!`,
      embeds: [
        new EmbedBuilder()
          .setColor(0x00ff00)
          .setTitle(`${client.user.username}`)
          .setTimestamp()
          .setFooter({
            text: `${client.user.username}`,
            iconURL: client.user.displayAvatarURL(),
          }),
      ],
    });
  },
};
