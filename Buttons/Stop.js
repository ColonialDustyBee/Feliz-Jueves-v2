const compute  = require('@google-cloud/compute');
const path = require('node:path');
const config = require(path.join(__dirname, '..', 'config.gcp.json')); // The filename has to be called config.gcp.json, you could edit it to find your own name
const mcstatus = require('node-mcstatus'); // Should check if anyone is on the server before initiating a shut down
const minecraftPort = 25565 
module.exports = { // Stop
    async execute(interaction) {
        console.log("Checking if Minecraft server is already turned off");
        const instancesClient = new compute.InstancesClient();
        console.log('Acquiring vm status');
        const [instance] = await instancesClient.get({ 
            project: config.project,
            zone: config.zone,
            instance: config.instance
        });
        const externalIp = instance.networkInterfaces[0].accessConfigs[0].natIP; // Grabs the external IP of the GCP instance
        console.log(`Minecraft Server IP: ${externalIp}`);
        try{
            if (instance.status === 'PENDING_STOP' || instance.status === 'STOPPING' || instance.status === 'TERMINATED') { // Checks if the vm is already turned off
                console.log('Minecraft server is already turned off');
                await interaction.editReply({
                    content: 'Minecraft server is already turned off',
                    ephemeral: true, // Set the message as ephemeral
                    components: []
                });
            }
            if (instance.status === 'PROVISIONING' || instance.status === 'STAGING'){ // Needs to be done to ensure Jueves can properly turn the server off
                console.log('Minecraft server is in the process of turning on, needs to wait a bit before it can turn off');
                await interaction.editReply({
                    content: 'Minecraft server is in the process of turning on, wait a bit before you can turn it off.',
                    ephemeral: true,
                    components: []
                });
            }
            const result = await mcstatus.statusJava(externalIp, minecraftPort);
            // online is undefined, makes sense if the server is offline
            if (!result.online){
                console.log("Server is offline, shutting down VM");
                await instancesClient.stop({ // The code is the exact same as the start command, you just stop this time.
                    project: config.project,
                    zone: config.zone,
                    instance: config.instance
                });
                await interaction.editReply({
                    content: 'Minecraft server has stopped!',
                    ephemeral: true,
                    components: []
                });
                console.log('Minecraft Server stopped!');
            }
            if (result.players.online <= 0) { 
                console.log("Stopping minecraft server");
                await instancesClient.stop({ // The code is the exact same as the start command, you just stop this time.
                    project: config.project,
                    zone: config.zone,
                    instance: config.instance
                });
                await interaction.editReply({
                    content: 'Minecraft server has stopped!',
                    ephemeral: true,
                    components: []
                });
                console.log('Minecraft Server stopped!');
            }   
            else{
                console.log(`There are currently ${result.players.online} players online, Can't shut down the server`);
                await interaction.editReply({
                    content: `There are currently ${result.players.online} players online, Can't shut down the server`,
                    ephemeral: true,
                    components: []
                })
            }
        }
        catch (error){
            console.error("Something occurred with the server, here's the interaction dump");
            console.error(error);
            console.error(interaction);
            await interaction.editReply({
                content: 'Something occurred when attempting to stop the server',
                ephemeral: true,
                components: []
            })
        }
    }
};