const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "uncaughtException",
  async execute(err, client) {
    console.log("Uncaught Exception:\n", err);

    let ErrorLoggingChannel = client.config.logChannel;

    const exceptionembed = new EmbedBuilder()
      .setTitle("Uncaught Exception")
      .setDescription(`\`\`\`${require("util").inspect(err)}\`\`\``)
      .setColor("Red");
    client.channels.cache
      .get(ErrorLoggingChannel)
      .send({ embeds: [exceptionembed] });
  },
};
