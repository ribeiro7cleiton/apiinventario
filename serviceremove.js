var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'SOPASTA_INVENTARIO',
  script: require('path').join('C:\\Apis\\inventario\\dist','server.js')   
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('uninstall',function(){
    console.log('Uninstall complete.');
    console.log('The service exists: ',svc.exists);
});

svc.uninstall();