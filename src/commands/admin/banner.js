const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionsBitField,
  Routes,
  DataResolver,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-banner")
    .setDescription("Change the banner of your bot")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addAttachmentOption((option) =>
      option.setName("banner").setDescription("The banner").setRequired(true)
    ),

  async execute(interaction, client) {
    const banner = interaction.options.getAttachment("banner");
    await client.rest.patch(Routes.user(), {
      body: { banner: await DataResolver.resolveImage(banner.url) },
    });
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`Banner changed successfully`)
          .setColor("Green"),
      ],
      ephemeral: true,
    });
  },
};
