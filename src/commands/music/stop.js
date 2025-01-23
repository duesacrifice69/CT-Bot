const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the currently playing music"),

  async execute(interaction, client) {
    const voiceChannel = interaction.member.voice.channel;

    const embed = new EmbedBuilder();

    if (!voiceChannel) {
      embed
        .setDescription("You need to be in a voice channel to stop the music!")
        .setColor("Red");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
      embed
        .setDescription("I am not currently playing anything!")
        .setColor("Red");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    connection.destroy();
    client.queue.delete(interaction.guild.id);

    embed.setDescription("Music stopped!").setColor("Green");
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
