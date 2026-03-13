const {toggleServer} = require('../gcpHandler/gcpController'); // Handles the GCP Instance spring up. 
module.exports = async (interaction) => {
    // Acknowledge the click immediately
<<<<<<< HEAD
    try{
        await interaction.deferUpdate();
        const status = await getServerStatus(); // Checks if GCP instance status
        console.log(status)
        if (interaction.customId === 'Start') {
            if (status === 'RUNNING') {
                await interaction.followUp("The minecraft server is already running");
=======
    await interaction.deferUpdate();
    try{
        await interaction.deferUpdate();
        const status = await getServerStatus(); // Checks if GCP instance status
        console.log(status)
        if (interaction.customId === 'Start') {
            if (status === 'RUNNING') {
<<<<<<< HEAD
                return await interaction.followUp("The minecraft server is already running");
>>>>>>> 7b1b06b (Added GCP VM starting capabilities for Minecraft Server)
=======
                await interaction.followUp("The minecraft server is already running");
>>>>>>> 5a2feaa (potential fix)
            }
            await toggleServer('START');
            await interaction.followUp('Starting Server!');
        }

        else if (interaction.customId === 'Stop') {
            if (status === 'TERMINATED' || status === 'STOPPING') {
<<<<<<< HEAD
<<<<<<< HEAD
                await interaction.followUp('The minecraft server has already stopped');
=======
                return await interaction.followUp('The minecraft server has already stopped');
>>>>>>> 7b1b06b (Added GCP VM starting capabilities for Minecraft Server)
=======
                await interaction.followUp('The minecraft server has already stopped');
>>>>>>> 5a2feaa (potential fix)
            }
            await toggleServer('STOP');
            await interaction.followUp("Shutting down minecraft server");
        }
    }
    catch (err){
        await interaction.followUp("Error fetching server status!")
    }
};