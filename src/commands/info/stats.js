const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Shows the bot's statistics"),

  async execute(interaction, client) {
    const guilds = client.guilds.cache;
    const totalUsers = guilds.reduce(
      (acc, guild) => acc + guild.memberCount,
      0
    );
    const guildCount = guilds.size;
    const uptime = formatUptime(client.uptime);
    const ping = Math.round(client.ws.ping);

    const commandCount = client.commands.size;

    const discordJsVersion = require("discord.js").version;
    const nodeJsVersion = process.version;

    const startUsage = process.cpuUsage();
    const endUsage = process.cpuUsage();
    const cpuUsage = calculateCpuUsage(startUsage, endUsage);

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(":gear: Bot Statistics")
      .setDescription(`Here's a summary of my current statistics:`)
      .addFields(
        {
          name: ":gear: Servers",
          value: `${guildCount}`,
          inline: true,
        },
        {
          name: ":gear: Users",
          value: `${totalUsers}`,
          inline: true,
        },
        {
          name: ":gear: Uptime",
          value: uptime,
          inline: true,
        },
        {
          name: ":gear: Latency",
          value: `${ping}ms`,
          inline: true,
        },
        {
          name: ":gear: Commands Used",
          value: `${commandCount}`,
          inline: true,
        },
        {
          name: ":gear: Node.js Version",
          value: nodeJsVersion,
          inline: true,
        },
        {
          name: ":gear: Discord.js Version",
          value: discordJsVersion,
          inline: true,
        },
        {
          name: ":gear: CPU Usage",
          value: `${cpuUsage.toFixed(2)}%`,
          inline: true,
        }
      );

    // Developers Section (Customize this with your information)
    const developers = [{ name: "chirath", id: "771639970854731808" }];

    embed.addFields(
      developers.map((dev) => ({
        name: `:gear: ${dev.name} (Developer)`,
        value: `<@${dev.id}>`,
        inline: true,
      }))
    );

    embed.setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};

// --- Helper Functions ---

function formatUptime(uptime) {
  const days = Math.floor(uptime / 86400000);
  const hours = Math.floor((uptime % 86400000) / 3600000);
  const minutes = Math.floor((uptime % 3600000) / 60000);
  const seconds = Math.floor((uptime % 60000) / 1000);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function calculateCpuUsage(startUsage, endUsage) {
  const totalTime =
    endUsage.system + endUsage.user - (startUsage.system + startUsage.user);
  return (totalTime / 10000) * 100;
}
