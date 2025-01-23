const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getVoiceConnection, AudioPlayerStatus } = require("@discordjs/voice");
const playNextSong = require("../../functions/music/playNextSong");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the currently playing song"),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      embed
        .setDescription("You need to be in a voice channel to skip the song!")
        .setColor("Red");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const serverQueue = client.queue.get(interaction.guild.id);

    if (serverQueue.songs.length === 1) {
      embed
        .setDescription("There are no songs in the queue to skip!")
        .setColor("Red");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

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

    const currentSong = serverQueue.songs.shift();
    serverQueue.loop = false;
    playNextSong(interaction, serverQueue);

    embed.setDescription(`Skipped **${currentSong.title}**.`).setColor("Green");
    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
