const DataStore = require("nedb");


exports.loadDB = (filepath) => {
   return userDB = new DataStore(
        {
            filename: filepath,
            timestampData: true,
            autoload: true
        }
    );
}
