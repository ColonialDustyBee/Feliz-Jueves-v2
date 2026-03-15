const compute = require('@google-cloud/compute');
const path = require('node:path');
const config = require(path.join(__dirname, '..', 'config.gcp.json')); // The filename has to be called config.gcp.json, you could edit it to find your own name
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
        try{
            if (instance.status === 'PENDING_STOP' || instance.status === 'STOPPING' || instance.status === 'TERMINATED') { // Checks if the vm is already turned off
                console.log('Minecraft server is already turned off');
                await interaction.editReply({
                    content: 'Minecraft server is already turned off',
                    components: []
                });
            }
            else {
                console.log("Stopping minecraft server");
                await instancesClient.stop({ // The code is the exact same as the start command, you just stop this time.
                    project: config.project,
                    zone: config.zone,
                    instance: config.instance
                });
                await interaction.editReply({
                    content: 'Minecraft server has stopped!',
                    components: []
                });
                console.log('Minecraft Server stopped!');
            }   
        }
        catch (error){
            console.error("Something occurred with the server, here's the interaction dump");
            console.error(error);
            console.error(interaction);
            await interaction.editReply({
                content: 'Something occurred when attempting to stop the server',
                components: []
            })
        }
    }
};