const ResearchDAO = require("../data/research-dao").ResearchDAO;
const needle = require("needle");
const { environmentalScripts } = require("../../config/config");

function ResearchHandler(db) {
  "use strict";

  const researchDAO = new ResearchDAO(db);

  this.displayResearch = (req, res) => {
    const url = req.query.url;
    if (url) {
      return needle.get(url, (error, newResponse, body) => {
        if (!error && newResponse.statusCode === 200) {
          res.writeHead(200, {
            "Content-Type": "text/html",
          });
        }

        res.write("\n\n");
        if (body) {
          res.write(body);
        }
        return res.end();
      });
    }
    return res.render("research", {
      environmentalScripts,
    });
  };
}

module.exports = ResearchHandler;
