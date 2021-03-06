// Main config for bike api fetching:
const apiFetchInterval = 5000;
const citybikeEndpoint = "http://api.citybik.es/v2/networks/";

// Fetch utils:
const fetch = require('node-fetch');

class BikeStationsNetwork {

    id = undefined;
    networkData = {};

    constructor(networkId) {
        this.id = networkId;
    }

    fetchNetworkData = () => {
        return new Promise((resolve, reject) => {
            console.log('Fetching data');
            fetch(citybikeEndpoint + this.id)
                .then(apiResponse => {
                    if (apiResponse.status === 200) {
                        apiResponse.json()
                            .then(networkData => {
                                resolve(networkData.network);
                            })
                            .catch(error => { console.log(error); reject(error); });
                    }
                    else {
                        console.log(apiResponse.status);
                    }
                })
                .catch(error => { console.log(error); reject(error); });
        })
    }

    checkForUpdates = (callback) => {
        this.fetchNetworkData()
            .then(newNetworkData => {
                
                let updatedData = { ...newNetworkData };

                // Enable this lines for testing reactivity on frontend:
                // try {
                //     for (let i = 0; i < updatedData.stations.length; i++) {
                //         updatedData.stations[i].free_bikes = updatedData.stations[i].free_bikes + 5;
                //     }
                // }
                // catch (error) { }

                if (JSON.stringify(updatedData) !== JSON.stringify(this.networkData)) {
                    callback(updatedData);
                    this.networkData = updatedData;
                }
            })
            .catch(error => { console.log(error); });
    }

    listenToUpdates = (callback) => {
        this.checkForUpdates(callback);
        setInterval(() => { this.checkForUpdates(callback); }, apiFetchInterval);
    }
}

module.exports = {
    BikeStationsNetwork
}
