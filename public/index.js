const fs = require("fs")
const content = fs.readFileSync("./repeat.woff", { encoding: "base64" })
console.log(content)
// fs.writeFileSync("./repeat.woff.base64", content)
