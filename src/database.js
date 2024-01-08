const knex = require('knex')({
    client: 'oracledb',
    connection: {
      host : '192.168.3.8',
      port : 1521,
      user : 'cosapiens',
      password : 'cosapiens',
      database : 'oraprd'
    }
  });
  
  export default knex;