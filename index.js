const fs = require('node:fs'); // Node's native file system module that is used to read the commands directory and read our command files we create there
const path = require('node:path'); // Helps construct paths to access files and directories, automatically detects the OS it's working in
const {Client, Collection, Events, GatewayIntentBits, AttachmentBuilder} = require('discord.js'); 
const client = new Client({intents : [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages]});
const dotenv = require('dotenv');
const channelID = ''; 
const cron = require('node-cron');

dotenv.config();

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
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

// JUEVES V1 STUFF
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
        cron.schedule('0 12 * * 4', () => { // Could possible make it so it sends at any other time but it's up to user discretion at that point
            sendWeeklyJueves();
        });
    }
    catch(error){
        console.error('Error scheduling cron job');
    }
}
client.login(process.env.DISCORD_TOKEN); 