const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: "https://api.convoai.tech/v1",
});

const availableModels = {
  "DALL-E 2": "dall-e-2",
  "DALL-E 3": "dall-e-3",
  // Add more models if supported by ConvoAI
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("imagine")
    .setDescription("Generate an image from a prompt")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("The prompt to generate the image from")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("model")
        .setDescription("The model to use for image generation")
        .setRequired(true)
        .setChoices(
          ...Object.entries(availableModels).map(([name, value]) => ({
            name,
            value,
          }))
        )
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const prompt = interaction.options.getString("prompt");
    const model =
      interaction.options.getString("model") || availableModels["DALL-E 2"]; // Default to DALL-E 2

    try {
      const response = await openai.images.generate({
        prompt,
        model,
        n: 1,
        size: "1024x1024",
      });
      const imageUrl = response.data[0].url;

      await interaction.editReply({ content: imageUrl });
    } catch (error) {
      console.error(error);
      if (
        error.response &&
        error.response.status === 400 &&
        error.code === "content_policy_violation"
      ) {
        const embed = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle("Error: Content Policy Violation")
          .setDescription(
            "Your request was rejected as it may contain content that is not allowed by our safety system. Please revise your prompt and try again."
          );
        await interaction.editReply({ embeds: [embed] });
      } else {
        await interaction.editReply({
          content: "An error occurred while generating the image.",
        });
      }
    }
  },
};
