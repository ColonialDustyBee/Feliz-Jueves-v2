const path = require('node:path');
module.exports = {
    async handleButton(interaction) {
        try {
           // This file might actually be better to just call other button files. Creates more modularity
           // Take the customId, make sure the filename is named the exact same as the customId in case I wanna do some more cool shit with buttons.
           await interaction.deferUpdate();
           console.log('Pressed button, will handle based on action');
           const buttonPress = interaction.customId; 
           console.log(`Calling ${buttonPress}`);
           const filePath = path.join(__dirname, `./${buttonPress}.js`);
           const moduleHandler = require(filePath);

           if (typeof moduleHandler.execute === 'function'){
            await moduleHandler.execute(interaction);
           }
           else {
            console.error(`File ${buttonPress}.js does not export an 'execute' function`)
           }

        } catch (error) {
            console.error("Error handling button:", error);
        }
    }
}