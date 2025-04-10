const { SlashCommandBuilder } = require('discord.js');

module.exports =  {
    data: new SlashCommandBuilder()
        .setName("video-fetch")
        .setDescription("Fetches random video"),
    async execute(interaction){
        await interaction.reply("Fetching random video...");
    }
};
