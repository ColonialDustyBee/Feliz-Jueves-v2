const compute = require('@google-cloud/compute');
const path = require('node:path');
const config = require(path.join(__dirname, '..', './config.gcp.json')); // The filename has to be called config.gcp.json, you could edit it to find your own name
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
                console.log('Minecraft server is already started');
                await interaction.editReply({
                    content: 'Minecraft server is already running',
                    components: []
                });
            }
            else{
                console.log("Starting minecraft server");
                const [operation] = await instancesClient.start(GCP_CONFIG);
                await operation.promise(); // Await the operation babey
                console.log('Minecraft Server started!');
                await interaction.editReply({
                    content: 'Minecraft server has started!',
                    components: []
                });
            }
            await interaction.editReply({
                content: 'Started!',
                components: [] // You have to declare the components as blank otherwise the buttons will not vanish. JavaScript in its grand wisdom ladies and gents
            });
        }
        catch(error){
            await interaction.editReply("Something went wrong with starting the server");
            console.error("Something went wrong");
            console.error(interaction);
        }
        
    }
};