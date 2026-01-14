const { SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Provides bot description'),
    async execute(interaction){
        await interaction.reply("Several commands are possible: \n video-download - Currently only works with youtube videos, will try to work other video sources\n Let me know if there are any other features you want me to add. I'm currently adding the meme archive fetcher");
    }
};
