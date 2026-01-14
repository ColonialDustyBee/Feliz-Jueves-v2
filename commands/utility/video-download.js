const { SlashCommandBuilder } = require('discord.js');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs'); // Fixed: removed the curly braces

module.exports = {
    data: new SlashCommandBuilder()
        .setName("video-download")
        .setDescription("Downloads video and sends it back in MP4 format")
        .addStringOption(option =>
            option.setName('link')
                .setDescription('Either youtube or instagram link')
                .setRequired(true)
        ),
    async execute(interaction) {
        const linkProvided = interaction.options.getString('link', true);

        // 1. URL Validation, ensures users can't just enter random files
        try {
            const url = new URL(linkProvided);
            const allowedDomains = ['youtube.com', 'youtu.be', 'instagram.com'];
            const isAllowed = allowedDomains.some(domain => url.hostname.endsWith(domain));
            if (!isAllowed) return interaction.reply({ content: "Please provide a valid link.", ephemeral: true });
        } catch (e) {
            return interaction.reply({ content: "Invalid URL.", ephemeral: true });
        }

        // 2. Makes jueves the thinker (makes discord's api wait for a response)
        await interaction.deferReply();

        const fileName = `video_${Date.now()}.mp4`; // Gives the file a unique name, avoids conflicts if two users were to enter the same video twice
        // Put the file in a temporary folder or the current directory
        const filePath = path.join(__dirname, fileName);

        // 3. Spawn process
        const ytProcess = spawn('yt-dlp', [
            '--cookies', './cookies.txt', // Path to cookies
            '-f', 'mp4',
            '-o', filePath,
            linkProvided
        ]);

        ytProcess.on('close', async (code) => {
            if (code !== 0) {
                return interaction.editReply("Error occurred while downloading.");
            }

            try {
                // 4. Send the file
                await interaction.editReply({
                    content: "Here is your video!",
                    files: [filePath]
                });
            } catch (err) {
                console.error(err);
                await interaction.editReply("Video downloaded, but it might be too large for Discord (25MB limit).");
            } finally {
                // 5. Cleanup: Delete the file
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        });
    }
};