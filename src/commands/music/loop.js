const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getVoiceConnection, AudioPlayerStatus } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Enable/Disable the currently playing song loop"),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      embed
        .setDescription("You need to be in a voice channel to pause the song!")
        .setColor("Red");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const serverQueue = client.queue.get(interaction.guild.id);
    const connection = getVoiceConnection(interaction.guild.id);

    if (
      !connection ||
      serverQueue.player.state.status !== AudioPlayerStatus.Playing
    ) {
      embed
        .setDescription("There is no song currently playing!")
        .setColor("Red");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    serverQueue.loop = !serverQueue.loop;
    embed
      .setDescription(`Loop **${serverQueue.loop ? "enabled" : "disabled"}**.`)
      .setColor("Green");
    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
