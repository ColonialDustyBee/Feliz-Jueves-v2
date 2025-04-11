const { SlashCommandBuilder } = require('discord.js');
const fs = {node:fs} // File system 

module.exports =  {
    data: new SlashCommandBuilder()
        .setName("video-fetch")
        .setDescription("Downloads video with link provided and sends it back in MP4 format")
        .addStringOption(option =>
            option.setName('link')
                .setDescription('Link to video to convert provided')
                .setRequired(true)

        ),
    async execute(interaction){
        const linkProvided = interaction.options.getString('link', true) 
        await interaction.reply("Fetching random video..."); 
        // Spawn child process
        // Make sure to pull identifiable ID from link for better filtering: https://www.youtube.com/watch?v=4jXEuIHY9ic'
        // Yt-dlp should include id of video.

    }
};
