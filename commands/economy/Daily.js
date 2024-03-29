const { EmbedBuilder } = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");

module.exports = {

    name: "daily",
    aliases: ["coins-system"],
    category: "economy",
    description: "Gives You 200 per day",
    usage: " ",
    accessableby: "everyone"
    ,
    run: async (message, args) => {
        let user = message.author;

        let timeout = 86400000;
        let amount = 200;

        let daily = await db.fetch(`daily_${user.id}`);

        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            let time = ms(timeout - (Date.now() - daily));

            let timeEmbed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`❌ You've already collected your daily reward\n\nCollect it again in ${time.hours}h ${time.minutes}m ${time.seconds}s `);
            message.channel.send({ embeds: [timeEmbed] })
        } else {
            let moneyEmbed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`✅ You've collected your daily reward of ${amount} coins`);
            message.channel.send({ embeds: [moneyEmbed] })
            db.add(`money_${user.id}`, amount)
            db.set(`daily_${user.id}`, Date.now())


        }
    }
}