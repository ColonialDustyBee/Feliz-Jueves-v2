// This should be relatively simple, will start and stop server.

const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('minecraft-server')
        .setDescription('Start or Stop the minecraft server from here'),
    
    async execute(interaction){ 
        const startButton = new ButtonBuilder()
            .setCustomId('Start')
            .setLabel('Start Server')
            .setStyle(ButtonStyle.Success) // Success is green
        
        const stopButton = new ButtonBuilder()
            .setCustomId('Stop')
            .setLabel('Stop Server')
            .setStyle(ButtonStyle.Danger) // Danger is red
        
        const buttonOptions = new ActionRowBuilder() // Builds the buttons
            .addComponents([startButton, stopButton])

        await interaction.reply({
            content: "Start or Stop the minecraft server!",
            components: [buttonOptions]
        });
    }
}
