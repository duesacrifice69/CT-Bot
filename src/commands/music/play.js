const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const {
  createAudioPlayer,
  joinVoiceChannel,
  NoSubscriberBehavior,
  entersState,
  VoiceConnectionStatus,
  AudioPlayerStatus,
  getVoiceConnection,
} = require("@discordjs/voice");
const play = require("play-dl");
const playNextSong = require("../../functions/music/playNextSong");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play songs")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Name or URL of the song")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      embed
        .setDescription("You need to be in a voice channel to play music!")
        .setColor("Red");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    await interaction.deferReply();

    const connection =
      getVoiceConnection(interaction.guild.id) ||
      joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 30e3);

      const args = interaction.options.getString("query");
      const isURL = args.startsWith("https://");
      let ytInfo = {};

      if (isURL) {
        const _ytInfo = await play.video_info(args);
        ytInfo = _ytInfo.video_details;
        ytInfo.description =
          ytInfo.description.length > 55
            ? ytInfo.description.slice(0, 55) + " ..."
            : ytInfo.description;
      } else {
        const searchResults = await play.search(args, { limit: 1 });
        if (searchResults.length === 0) {
          embed
            .setDescription("No songs found for the given query.")
            .setColor("Red");
          return interaction.editReply({ embeds: [embed] });
        }

        ytInfo = searchResults[0];
      }
      // Queue Logic
      let serverQueue = client.queue.get(interaction.guild.id);
      if (!serverQueue) {
        serverQueue = {
          songs: [],
          loop: false,
          connection: connection,
          player: createAudioPlayer({
            behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
          }),
        };
        client.queue.set(interaction.guild.id, serverQueue);

        serverQueue.player.on(AudioPlayerStatus.Idle, () => {
          if (!serverQueue.loop) {
            serverQueue.songs.shift();
          }
          playNextSong(interaction, serverQueue);
        });
      }

      serverQueue.songs.push(ytInfo);

      if (serverQueue.player.state.status !== AudioPlayerStatus.Playing) {
        playNextSong(interaction, serverQueue);
        embed.setDescription(`Now playing **${ytInfo.title}**.`);
      } else {
        embed.setDescription(
          `Your song **${ytInfo.title}** has been added to the queue.`
        );
      }

      embed
        .setThumbnail(ytInfo.thumbnails[0].url)
        .setURL(ytInfo.url)
        .setColor("Green");
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error playing song:", error);
      await interaction.followUp({
        content: "An error occurred while trying to play the song.",
        ephemeral: true,
      });
    }
  },
};
