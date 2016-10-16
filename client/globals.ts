import { RestClient } from './Utils/RestClient';

export namespace Services {
    
}

export let client: RestClient; 

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

})();