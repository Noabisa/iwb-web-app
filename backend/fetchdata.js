const db = require('./db'); // your pool file

async function fetchData(query) {
  const [rows] = await db.execute(query);
  return rows;
}

module.exports = fetchData;
