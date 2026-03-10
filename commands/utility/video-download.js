const { SlashCommandBuilder } = require('discord.js');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const queue = [];
let isProcessing = false;
let sentences = [
 "ur gay lol",
 "Thanks for downloading!",
 "pookie want a cookie?",
 "pls give me cock",
 "9/11 isn't real",
 "Benjamin netanyahu, please, im so very cold.",
 "Did you know zero was an even number? I didnt",
 "Glados did nothing wrong, i sympathize with her actually",
 "Cmon innnn, bigdickbitch dot com, bigdickbitch dot com",
 "I see what you downloaded, you sick fuck",
 "stop sucking cock and just do it already bro",
 "We were having a moment, fuck you!",
 "Boy ill french kiss you",
 "Ay, i got a glock in my rari",
 "Sir pls, sir she told me it was okay",
 "i wanna squirt in you as hard as when you open a shaken soda",
 "janet is a sick fuck, she made like half of these",
 "Postgre SQL implementation coming soon",
 "boy i have explosive diarrhea i be blowing like a volcano",
 "the bugs are back",
 "jorking, jorking the peener",
 "fucking kill me with a smile",
 "the closet youre keeping me in smells like fucking mildew and sweat. gross.",
 "Feliz Jueves! Pero no se como decirlo sin accento, asi no mas lo dices, feliz jueves?",
 "u gay if you touch yourself cause ur touching someones dick",
 "fleshlight is better than my wife",
 "you look like if covid 19 and ebola had a baby, what does that even mean? who the fuck knows",
 "pull the trigger baby girl you can do it",
 "i saw you slurp that weiner you whore",
 "jesus is a furry",
 "glock that cock",
 "if god didnt want gay sex, then why is a mans g spot in the booty hole?"
]; // I'll probably make a postgreSQL at some point that does this for me. For now, this will have to do.
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
            await interaction.editReply("Incorrect type of URL!, please use the support URLs");
        }
    }
};
// Checks for url
function checkURL(linkProvided) { 
    try {
        const url = new URL(linkProvided);
        const allowedDomains = ['youtube.com', 'youtu.be', 'instagram.com', 'tiktok.com', 'x.com', 'facebook.com', 'reddit.com'];
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
        const minDelay = 30000; // 30 seconds
        const maxDelay = 60000; // 60 seconds
        const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);
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
	    '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
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
                const interactionReplyIndex = Math.floor(Math.random() * sentences.length);
                
                if (fileSizeInMB > 100) {
                    await interaction.editReply("Video downloaded! but can't send, might exceed the limit (100mbs for boosted servers, 25mb for the rest");
                } else {
                    await interaction.editReply({
                        content: sentences[interactionReplyIndex],
                        files: [filePath]
                    });
                }
            } catch (err) {
                console.error("File send error:", err);
                await interaction.editReply("Failed to send the video file.");
            } finally {
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
