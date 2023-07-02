function Html() {
    const fs = require("fs")
    const path = require("path")
    return fs.readFileSync(path.resolve(__dirname, "about.html"), {encoding: "utf8"}).toString("utf8")
}

module.exports = Html;
