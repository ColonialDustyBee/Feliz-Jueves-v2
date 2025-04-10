const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('video-fetch')
        .setDescription('Uses a link to pull a video directly'),
    async execute(link){
        console.log(link)
    }
};