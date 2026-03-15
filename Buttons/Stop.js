module.exports = { // Stop
    async execute(interaction) {
        console.log("This is the code for the Stop button!");
        await interaction.editReply({ 
            content: 'Stopped!',
            components: []
        
        });
    }
};