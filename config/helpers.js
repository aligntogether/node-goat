const fs = require("fs");
const fsWriteLog = (data) => {
  console.log("error data", data);
  var logStream = fs.createWriteStream("log.txt", { flags: "a" });
  // use {flags: 'a'} to append and {flags: 'w'} to erase and write a new file
  logStream.write(`\n\n <br> ${new Date()} #>`);
  logStream.write(data.toString());
  logStream.end("\n \n ");
};
module.exports = { fsWriteLog };
