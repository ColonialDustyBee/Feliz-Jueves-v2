const {REST, Routes} = require('discord.js');
const {clientId, guildId, token} = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = []
// Grab all command folders from command directories
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders){
    // Grab all command files from command directories
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles){
        const filePath = path.join(commandsPath, file);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('js'));
        // Grab slashcommandbuildertoJson Output of each command's data for deployment, allows us to edit commands without redeployment
        for (const file of commandFiles){
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if('data' in command && 'execute' in command){
                commands.push(command.data.toJSON());
            }
            else{
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" proerty.`);
            }
        }
    }
}

// constructs and prepares a REST instance

const rest = new REST().setToken(token); // Grabs discord token

// Deploys commands
(async () => {
    try{
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        // Refreshes all commands in guild with current set.
        const data = await rest.put(
            Routes.applicationCommands(clientId,guildId),
            { body: commands },
        );
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    }
    catch(error){
        console.error(error);
    }
})();
