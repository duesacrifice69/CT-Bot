const { createAudioResource } = require("@discordjs/voice");
const { EmbedBuilder } = require("discord.js");
const play = require("play-dl");

module.exports = async function playNextSong(interaction, serverQueue) {
  if (serverQueue.songs.length === 0) {
    serverQueue.connection.destroy();
    return;
  }

  const song = serverQueue.songs[0];
  const stream = await play.stream(song.url);
  const resource = createAudioResource(stream.stream, {
    inputType: stream.type,
  });

  serverQueue.player.play(resource);
  serverQueue.connection.subscribe(serverQueue.player);

  if (!serverQueue.loop) {
    const embed = new EmbedBuilder()
      .setTitle(`Now Playing: ${song.title}`)
      .setDescription(song.description || "No description available")
      .setThumbnail(song.thumbnails[0].url)
      .setURL(song.url)
      .setColor("Blue");
    await interaction.followUp({ embeds: [embed] });
  }
};
