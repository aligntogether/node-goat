const fs = require("fs");
const pac = require("pac-resolver");
function AdvanceHandler() {
  "use strict";

  this.displayPage = (req, res, next) => {
    res.set({
      "X-Powered-By": "pac-resolver 4.2.0",
    });
    return res.render("advance", {});
  };
  this.handleProxy = (req, res, next) => {
    const pacfile = req.file.path;
    var FindProxyForURL = pac(fs.readFileSync(pacfile));
    let data = FindProxyForURL("http://foo.com/", "0.0.0.0").then((data) => {
      return data;
    });
    data.then((data) => {
      res.render("advance", { proxyData: data });
    });
  };

  function proxygen(host, url, proxyurl) {
    template = `function FindProxyForURL(${url}, ${host}) {
        if (
          (isPlainHostName(${host}) || dnsDomainIs(${host}, "${url}")) &&
          !localHostOrDomainIs(${host}, "${url}") 
        ) {
          return "DIRECT";
        } else {
          return "PROXY ${proxyurl}; DIRECT";
        }
      }`;
    return template;
  }
}

module.exports = AdvanceHandler;
