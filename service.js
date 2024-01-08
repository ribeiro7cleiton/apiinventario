var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'SOPASTA_INVENTARIO',
  description: 'Api para comunicar com app inventário da Sopasta',
  script: 'C:\\Apis\\inventario\\dist\\server.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.logOnAs.domain = 'SOPASTA';
svc.logOnAs.account = 'ADMINISTRADOR';
svc.logOnAs.password = 'MKq!96fc@Ws';
svc.install();