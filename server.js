const app = require('./express/server');

app.listen(process.env.PORT, () => console.log('Local app listening on port '));