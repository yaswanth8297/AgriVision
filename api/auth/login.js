const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const dataFilePath = path.join(process.cwd(), 'data', 'database.json');
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const db = JSON.parse(fileData);
    const defaultUser = db.users && db.users.length > 0 ? db.users[0] : null;

    return res.status(200).json({
      success: true,
      user: defaultUser
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      user: {
        id: 'usr_apparao',
        name: 'Apparao Nimmana',
        email: 'apparao@agrivision.in',
        role: 'farmer'
      }
    });
  }
};

