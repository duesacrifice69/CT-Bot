const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getVoiceConnection, AudioPlayerStatus } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume the currently paused song"),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      embed
        .setDescription("You need to be in a voice channel to resume the song!")
        .setColor("Red");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const serverQueue = client.queue.get(interaction.guild.id);

    if (!serverQueue) {
      embed.setDescription("There is no active queue!").setColor("Red");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const connection = getVoiceConnection(interaction.guild.id);

    if (
      !connection ||
      serverQueue.player.state.status !== AudioPlayerStatus.Paused
    ) {
      embed
        .setDescription("There is no song currently paused!")
        .setColor("Red");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    serverQueue.player.unpause();
    const currentSong = serverQueue.songs[0];
    embed.setDescription(`Resumed **${currentSong.title}**.`).setColor("Green");
    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
