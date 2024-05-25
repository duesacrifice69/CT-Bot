const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-avatar")
    .setDescription("Change the avatar of your bot")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addAttachmentOption((option) =>
      option.setName("avatar").setDescription("The avatar").setRequired(true)
    ),

  async execute(interaction, client) {
    const avatar = interaction.options.getAttachment("avatar");
    await client.user.setAvatar(avatar.url);
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`Avatar changed successfully`)
          .setColor("Green"),
      ],
      ephemeral: true,
    });
  },
};
