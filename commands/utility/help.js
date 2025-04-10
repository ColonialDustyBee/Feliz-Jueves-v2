const { SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Provides bot description'),
    async execute(interaction){
        await interaction.reply("Several commands are possible: \n video-fetch - Will fetch a random meme from an archive. mostly consisting of videos \n yt-downloader - will take a link and fetch the contents and send it over.")
    }
    
};
