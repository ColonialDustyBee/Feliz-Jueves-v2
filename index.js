const fs = require('node:fs'); // Node's native file system module that is used to read the commands directory and read our command files we create there
const path = require('node:path'); // Helps construct paths to access files and directories, automatically detects the OS it's working in
const {Client, Collection, Events, GatewayIntentBits, AttachmentBuilder} = require('discord.js'); 
const client = new Client({intents : [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages]});
const juevesAttachment = new AttachmentBuilder('FelizJuevesVideo/FelizJueves.mp4', {name: 'FelizJueves.mp4'});
client.commands = new Collection(); // Allows us to read commands in other files with the .commands property
const foldersPath = path.join(__dirname, 'commands'); // Sets path to our commands directory
const commandFolders = fs.readdirSync(foldersPath); // Reads commands directory
const dotenv = require('dotenv');
const channelID = ''; 
const cron = require('node-cron');

dotenv.config();

for (const folder of commandFolders){
    const commandsPath = path.join(foldersPath, folder); // joins the folders inside of the commands folder, mainly the utility folder in this case
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // Only reads the javascript files
    for (const file of commandFiles){
        const filePath = path.join(commandsPath, file); // Joins path where command file is located in
        const command = require(filePath); // fetches command from commands.js using the path that we defined where the file is located too

        if('data' in command && 'execute' in command){ // Finds data and execute pair that we defined in commands.js
            client.commands.set(command.data.name, command);
        }
        else{
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);    
        }
    }
}

client.once(Events.ClientReady, readyClient => { // Allows us to confirm that the bot has been turned on
    console.log(`Logged in as ${readyClient.user.tag}!`);
    scheduleWeeklyJueves();
});
client.on(Events.InteractionCreate, async interaction => { // Reads interactions from users.
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command){
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try{
        await command.execute(interaction);
    }
    catch(error){
        console.error(error); // Debugging goes brr
        if (interaction.replied || interaction.deferred){
            await interaction.followUp({content: 'There was an error while executing this command!', ephemeral: true}); 
        }
        else{
            await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
        }
    }
    
});
client.on(Events.MessageCreate, async (message) => { // allows for message interaction to be possible.
    if(message.content.toLowerCase().includes("jueves")){
        await message.channel.send({files: [juevesAttachment]});
    }
});
function sendWeeklyJueves(){
    const channel = client.channels.cache.get(channelID);
    if(channel){
      channel.send({files: [juevesAttachment]});
    }
}
function scheduleWeeklyJueves(){
    try{
        cron.schedule('0 12 * * 4', () => {
            sendWeeklyJueves();
        });
    }
    catch(error){
        console.error('Error scheduling cron job');
    }
}
client.login('INSERT YOUR TOKEN HERE, BE SURE IT IS HIDDEN'); 