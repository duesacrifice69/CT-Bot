const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getVoiceConnection, AudioPlayerStatus } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Display the currently playing song"),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      embed
        .setDescription("You need to be in a voice channel to get the song!")
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

    const currentSong = serverQueue.songs[0];
    embed
      .setTitle(`Now Playing: ${currentSong.title}`)
      .setDescription(currentSong.description || "No description available")
      .setThumbnail(currentSong.thumbnails[0].url)
      .setURL(currentSong.url)
      .setColor("Blue");
    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
