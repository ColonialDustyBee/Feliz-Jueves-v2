const { SlashCommandBuilder } = require('discord.js');
const { spawn } = require('child_process');
const crypto = require('crypto'); // gives us message digest capabilities
const { link } = require('fs');
module.exports =  {
    data: new SlashCommandBuilder()
        .setName("video-download")
        .setDescription("Downloads video with link provided and sends it back in MP4 format")
        .addStringOption(option =>
            option.setName('link')
                .setDescription('Link to video to convert provided')
                .setRequired(true)

        ),
    async execute(interaction){
        // Get the string provided
        const linkProvided = interaction.options.getString('link', true)
        
        // Spawn child process with args. Might need to make this an API at some point in the future.
        // Can make two separate child processes for both audio and video respectively. need to see if this will work with video first though
        const ytProcess = spawn('yt-dlp', linkProvided);
        const finalPath = '';

        // Capture stdout (progress + final filepath)
        ytProcess.stdout.on('data', data => {
            const text = data.toString().trim(); // Gets rid of whitespace
            finalPath = text;       // last line = downloaded file
        });

        // When process finishes
        ytProcess.on('close', code => {
            if (code === 0) onFinish(finalPath);          // success → call callback
            else onError(new Error(`yt-dlp exited with code ${code}`)); // failure → call error callback
        });
    }
};
