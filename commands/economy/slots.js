const slotItems = ["🍇", "🍉", "🍌", "🍎", "🍒"];
const db = require("quick.db");
const { EmbedBuilder } = require('discord.js');

module.exports = {

    name: "slots",
    aliases: ["sl"],
    category: "economy",
    description: "Slot game | 9x - rare | 3x - common",
    usage: "<amount>",
    accessableby: ""
    ,
    run: async (client, message, args) => {

        let user = message.author;
        let moneydb = await db.fetch(`money_${user.id}`)
        let money = parseInt(args[0]);
        let win = false;

        let moneymore = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`❌ You are betting more than you have`);

        let moneyhelp = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`❌ Specify an amount`);

        if (!money) return message.channel.send({ embeds: [moneyhelp] });
        if (money > moneydb) return message.channel.send({ embeds: [moneymore] });

        let number = []
        for (let i = 0; i < 3; i++) { number[i] = Math.floor(Math.random() * slotItems.length); }

        if (number[0] == number[1] && number[1] == number[2]) {
            money *= 9
            win = true;
        } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) {
            money *= 3
            win = true;
        }
        if (win) {
            let slotsEmbed1 = new EmbedBuilder()
                .setDescription(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\nYou won ${money} coins`)
                .setColor("Green")
            message.channel.send({ embeds: [slotsEmbed1] })
            db.add(`money_${user.id}`, money)
        } else {
            let slotsEmbed = new EmbedBuilder()
                .setDescription(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\nYou lost ${money} coins`)
                .setColor("Green")
            message.channel.send({ embeds: [slotsEmbed] })
            db.subtract(`money_${user.id}`, money)
        }

    }
}