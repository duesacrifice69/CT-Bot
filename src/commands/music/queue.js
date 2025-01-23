const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getVoiceConnection, AudioPlayerStatus } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Display the queue fpr your server"),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();
    const serverQueue = client.queue.get(interaction.guild.id);
    const connection = getVoiceConnection(interaction.guild.id);
    let description = "";

    if (
      !connection ||
      serverQueue.player.state.status !== AudioPlayerStatus.Playing ||
      serverQueue.player.state.status !== AudioPlayerStatus.Paused
    ) {
      embed
        .setDescription("There is no song currently playing!")
        .setColor("Red");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (serverQueue.songs.length <= 1) {
      embed.setDescription("There are no songs in the queue").setColor("Red");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    serverQueue.songs.map((song, i) => {
      if (i === 0) return;
      description += `${i}. ${song.title} \n`;
    });
    embed.setTitle("Current Queue");
    embed.setDescription(description).setColor("Blue");
    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
