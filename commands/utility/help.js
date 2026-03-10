const { SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Provides bot description'),
    async execute(interaction){
        await interaction.reply("She's alive! Currently she supports the following command: \n video-download: link (currently supports youtube, twitter, reddit, instagram, and tiktok videos.\n Currently working on adding: meme-fetcher, line adding command that will give her more lines to say when downloading based on what you sick fucks send her");
    }
};
