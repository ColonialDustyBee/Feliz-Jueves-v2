const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Provides bot description'),
    async execute(interaction){
        await interaction.reply("Thanks for choosing Jueves! This bot has a few simple features. Firstly, entering the word 'Jueves' in any sentence will send a funny video of asuka.\n Also the bot is programmed to send the video every Thursday as well. In a later update, you'll be able to roll for a random meme alongside it's current features!")
    }
    
};