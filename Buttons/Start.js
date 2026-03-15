const compute = require('@google-cloud/compute');
const path = require('node:path');
const config = require(path.join(__dirname, '..', 'config.gcp.json')); // The filename has to be called config.gcp.json, you could edit it to find your own name4
module.exports = { // Start
    async execute(interaction) {
        console.log("Checking if Minecraft Server can be ran")
        const instancesClient = new compute.InstancesClient();
        const operationsClient = new compute.ZoneOperationsClient();
        console.log('Acquiring vm status');
        const [instance] = await instancesClient.get({
            project: config.project,
            zone: config.zone,
            instance: config.instance
        });
        if (instance.status === 'RUNNING' || instance.status === 'STAGING' || instance.status === 'RUNNING') { // Checks if the vm is already turned on
            console.log('Minecraft server is already running');
            await interaction.editReply({
                content: 'Minecraft server is already running',
                components: []
            });
        }
        else {
            console.log("Starting minecraft server");
            const [operation] = await instancesClient.start({
                project: config.project,
                zone: config.zone,
                instance: config.instance
            });
            const operationName = operationResponse.name;
            await operationsClient.wait({
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
};