const {toggleServer} = require('../gcpHandler/gcpController'); // Handles the GCP Instance spring up. 
module.exports = async (interaction) => {
    // Acknowledge the click immediately
    try{
        await interaction.deferUpdate();
        const status = await getServerStatus(); // Checks if GCP instance status
        console.log(status)
        if (interaction.customId === 'Start') {
            if (status === 'RUNNING') {
                await interaction.followUp("The minecraft server is already running");
            }
            await toggleServer('START');
            await interaction.followUp('Starting Server!');
        }

        else if (interaction.customId === 'Stop') {
            if (status === 'TERMINATED' || status === 'STOPPING') {
                await interaction.followUp('The minecraft server has already stopped');
            }
            await toggleServer('STOP');
            await interaction.followUp("Shutting down minecraft server");
        }
    }
    catch (err){
        await interaction.followUp("Error fetching server status!")
    }
};