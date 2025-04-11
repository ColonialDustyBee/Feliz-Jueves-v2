const { SlashCommandBuilder } = require('discord.js');

module.exports =  {
    data: new SlashCommandBuilder()
        .setName("video-fetch")
        .setDescription("Fetches random video")
        .addStringOption(option =>
            option.setName('link')
                .setDescription('Link to viddeo to convert provided')
                .setRequired(true)

        ),
    async execute(interaction){
        const linkProvided = interaction.options.getString('link', true) 
        await interaction.reply("Fetching random video..."); 
        

    }
};
