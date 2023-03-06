require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const util = require('util');

const DMWEBSERVICE_MONGODB_USER = process.env.DMWEBSERVICE_MONGODB_USER;
const DMWEBSERVICE_MONGODB_PASS = process.env.DMWEBSERVICE_MONGODB_PASS;
const DMWEBSERVICE_MONGODB_CERTS_FILE = process.env.DMWEBSERVICE_MONGODB_CERTS_FILE;
const DMWEBSERVICE_MONGODB_CONNECTION_STRING = process.env.DMWEBSERVICE_MONGODB_CONNECTION_STRING;
console.log('configuration: ', { DMWEBSERVICE_MONGODB_USER, DMWEBSERVICE_MONGODB_PASS, DMWEBSERVICE_MONGODB_CERTS_FILE, DMWEBSERVICE_MONGODB_CONNECTION_STRING });

if (mongoose.connection.readyState === 0) {
  const mongooseConf = {
    user: DMWEBSERVICE_MONGODB_USER,
    pass: DMWEBSERVICE_MONGODB_PASS,
    sslCA: DMWEBSERVICE_MONGODB_CERTS_FILE,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 5,
  };
  mongoose.connect(DMWEBSERVICE_MONGODB_CONNECTION_STRING, mongooseConf, function (err) {
    if (err) {
      console.error('❌ Mongoose connect error: ', err);
      const sanitizedError = util.inspect(Array.from(err?.reason?.servers).map(([serverName, desc]) => { return { [serverName]: util.inspect(desc.error) } }));
      console.log('Servers: ', sanitizedError);
      fs.writeFileSync('./err.json', sanitizedError);
      process.exit(-1);
    }
    console.log('✅ DB connection is established: ', mongoose.connection.readyState);
    process.exit(0);
  });
}
