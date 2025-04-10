const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('video-fetch')
        .setDescription('Randomly pulls from an archive of videos that is then sent directly to channel'),
    
};