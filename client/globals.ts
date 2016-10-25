import { RestClient } from './Utils/RestClient';

import { Services, setClientForAllServices } from './generated/client';

export let client: RestClient;
export let services = Services;

let initOnce = false;

// FFE to create things in order
(function(){
    if (initOnce) {
        return;
    }
    initOnce = true;

    client = new RestClient({
        endpoint: 'http://localhost:8081'
    });

    // set up the REST clients.
    setClientForAllServices(client);

})();