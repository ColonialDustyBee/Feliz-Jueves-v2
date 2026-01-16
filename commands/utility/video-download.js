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

// Fix 3: Removed async as URL parsing is synchronous
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
        console.log(filePath);
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

       // yt-dlp renames the file at the very end; this ensures the file exists before we 'stat' it.
        setTimeout(async () => {
            try {
                if (!fs.existsSync(filePath)) {
                    console.error(`ENOENT: File not found at ${filePath}`);
                    await interaction.editReply("Internal error: Download finished but file is missing.");
                    return resolve();
                }

                const stats = fs.statSync(filePath);
                const fileSizeInMB = stats.size / (1024 * 1024);

                if (fileSizeInMB > 25) { // Adjusted for standard Discord limit
                    await interaction.editReply(`Video downloaded but it is too large to send (${fileSizeInMB.toFixed(2)}MB).`);
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
                // Added a small delay before cleanup to ensure the upload is 100% finished
                setTimeout(() => {
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                    resolve();
                }, 2000);
            }
        }, 5000);
        ytProcess.on('error', (err) => {
            console.error("Spawn error:", err);
            resolve(); // Don't let the queue hang
        });
    });
}