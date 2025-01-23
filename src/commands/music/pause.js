const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getVoiceConnection, AudioPlayerStatus } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the currently playing song"),

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
    serverQueue.player.pause();
    const currentSong = serverQueue.songs[0];
    embed.setDescription(`Paused **${currentSong.title}**.`).setColor("Green");
    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
