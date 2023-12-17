const config = require('./utils/config');
const app = require('./app/app');

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
