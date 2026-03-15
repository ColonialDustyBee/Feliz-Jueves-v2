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
            if (instance.status === 'RUNNING' || instance.status === 'STAGING' || instance.status === 'RUNNING') { // Checks if the vm is already turned on
                console.log('Minecraft server is already running');
                await interaction.editReply({
                    content: 'Minecraft server is already running',
                    components: []
                });
            }
            else {
                console.log("Starting minecraft server");
                await instancesClient.start({ // why would I need to check for it twice? we already do the check beforehand anyway
                    project: config.project,
                    zone: config.zone,
                    instance: config.instance
                });
                await interaction.editReply({
                    content: 'Minecraft server has started!',
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
                components: []
            })
        }
    }
};