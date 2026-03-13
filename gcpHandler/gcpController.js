const config = require('../config.gcp.json'); // You'll need your config file. This bot should start the server within my GCP instance anyway so, makes it easier
const { InstancesClient }= require('@google-cloud/compute').v1; 
const computeClient = new InstancesClient()

const GCP_CONFIG = { 
        project: config.project,
        zone: config.zone,
        instance: config.instance
}

async function getServerStatus(){ // Should check for server
<<<<<<< HEAD
<<<<<<< HEAD
    const [instance] = await computeClient.get(GCP_CONFIG);
=======
    const [instance] = await computeClient.get({GCP_CONFIG});
>>>>>>> 7b1b06b (Added GCP VM starting capabilities for Minecraft Server)
=======
    const [instance] = await computeClient.get(GCP_CONFIG);
>>>>>>> 5a2feaa (potential fix)
    return instance.status; // will return status
}

async function toggleServer(action){
    
    if (action === "START"){
        const [operation] = await computeClient.start(GCP_CONFIG);
        await operation.promise(); // Gives us response back
    }
    if (action === "STOP"){
        const [operation] = await computeClient.stop(GCP_CONFIG);
        await operation.promise();
    }
}
