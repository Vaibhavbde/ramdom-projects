const fs = require("fs")
const csv  = require("csv-parser")

const results = [];

const fetchcsv = async () => {
  fs.createReadStream("../backend/assets/space_natural_calamities.csv")
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
});
}

module.exports = fetchcsv

