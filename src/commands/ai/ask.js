const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const openai = require("../../functions/ai/index.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask the AI a question")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("Your question for the AI")
        .setRequired(true)
    ),
  async execute(interaction) {
    const question = interaction.options.getString("question");
    await interaction.deferReply();

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: question },
        ],
        temperature: 0.7,
        max_tokens: 150,
      });

      const aiResponse = response.choices[0].message.content;

      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("AI Response")
        .setDescription(aiResponse)
        .setFooter({ text: "Powered by ConvoAI" })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error:", error);
      await interaction.editReply(
        "There was an error processing your request."
      );
    }
  },
};
