const compute = require('@google-cloud/compute');
const path = require('node:path');
const config = require(path.join(__dirname, '..', 'config.gcp.json')); // The filename has to be called config.gcp.json, you could edit it to find your own name
module.exports = { // Start
    async execute(interaction) {
        console.log("Checking if Minecraft Server can be ran")
        const instancesClient = new compute.InstancesClient();
        console.log('Acquiring vm status');
        const [instance] = await instancesClient.get({
            project: config.project,
            zone: config.zone,
            instance: config.instance
        });
        try{
            if (instance.status === 'RUNNING' || instance.status === 'STAGING' || instance.status === 'PROVISIONING') { // Checks if the vm is already turned on
                console.log('Minecraft server is already running');
                await interaction.editReply({
                    content: 'Minecraft server is already running',
                    ephemeral: true, // Set the message as ephemeral
                    components: []
                });
            }
            else if(instance.status === 'STOPPING' || instance.status === 'PENDING_STOP'){ // Check if the server is in the process of stopping. Needs to be done to ensure Jueves can turn on the vm
                console.log("Minecraft server is in the process of stopping");
                await interaction.editReply({
                    content: 'Minecraft server is in the process of stopping, wait a bit before trying to start it again.',
                    ephemeral: true,
                    components: []
                });
            } 
            else { // It HAS to be terminated
                console.log("Starting minecraft server");
                await instancesClient.start({ // why would I need to check for it twice? we already do the check beforehand anyway
                    project: config.project,
                    zone: config.zone,
                    instance: config.instance
                });
                await interaction.editReply({
                    content: 'Minecraft server has started!',
                    ephemeral: true, // Set the message as ephemeral
                    components: []
                });
                console.log('Minecraft Server started!');
            }   
        }
        catch (error){
            console.error("Something occurred with the server, here's the interaction dump");
            console.error(error);
            console.error(interaction);
            await interaction.editReply({
                content: 'Something occurred when attempting to start the server',
                ephemeral: true, // Set the message as ephemeral
                components: []
            })
        }
    }
};