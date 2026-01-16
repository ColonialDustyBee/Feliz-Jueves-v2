const { SlashCommandBuilder } = require('discord.js');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const queue = [];
let isProcessing = false;

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
        
        await interaction.deferReply(); 

        // Fix 1: checkURL is now synchronous or awaited correctly
        const validURL = checkURL(linkProvided);
        
        if (validURL) {
            // Fix 2: Changed key to 'link' so it matches processQueue
            queue.push({ interaction, link: linkProvided });
            processQueue();
        } else {
            await interaction.editReply("Incorrect type of URL! Please use YouTube, Instagram, or TikTok.");
        }
    }
};
// Checks for url
function checkURL(linkProvided) { 
    try {
        const url = new URL(linkProvided);
        const allowedDomains = ['youtube.com', 'youtu.be', 'instagram.com', 'tiktok.com', 'x.com'];
        return allowedDomains.some(domain => url.hostname.endsWith(domain));
    } catch (e) {
        return false;
    }
}

async function processQueue() {
    if (isProcessing || queue.length === 0) return;
    isProcessing = true;

    const { interaction, link } = queue.shift(); 
    try {
        await downloadAndSend(interaction, link);
    } catch (error) {
        console.error("Queue Error:", error);
    } finally {
        const delay = Math.floor(Math.random() * (7000 - 3000 + 1) + 3000);
        setTimeout(() => {
            isProcessing = false;
            processQueue();
        }, delay);
    }
}

function downloadAndSend(interaction, link) {
    return new Promise((resolve) => { 
        const fileName = `video_${Date.now()}.mp4`;
        const filePath = path.join(__dirname, fileName);

        const ytProcess = spawn('yt-dlp', [
            '--cookies', './cookies.txt',
            '--no-playlist',
            // Merges best video and audio into mp4
            '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            '-o', filePath,
            link
        ]);

        // Logging errors to your terminal for debugging
        ytProcess.stderr.on('data', (data) => {
            console.error(`yt-dlp error: ${data}`);
        });

        ytProcess.on('close', async (code) => {
            if (code !== 0) {
                await interaction.editReply("Error occurred while downloading. Check console for details.");
                return resolve(); 
            }

            try {
                const stats = fs.statSync(filePath);
                const fileSizeInMB = stats.size / (1024 * 1024);

                if (fileSizeInMB > 100) {
                    await interaction.editReply("Video downloaded! but can't send, might exceed the limit (100mbs for boosted servers, 25mb for the rest");
                } else {
                    await interaction.editReply({
                        content: "Here is your video!",
                        files: [filePath]
                    });
                }
            } catch (err) {
                console.error("File send error:", err);
                await interaction.editReply("Failed to send the video file.");
            } finally {
                // Fix 5: Cleanup and always resolve to keep queue moving
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                resolve();
            }
        });

        ytProcess.on('error', (err) => {
            console.error("Spawn error:", err);
            resolve(); // Don't let the queue hang
        });
    });
}