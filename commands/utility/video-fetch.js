const { SlashCommandBuilder } = require('discord.js');
const { ChildProcess } = require('child_process');

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
        // We'll want one for Instagram and one for YT
        const linkProvided = interaction.options.getString('link', true) 
        
        

    }
};
