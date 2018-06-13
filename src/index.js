const { writeProjectPropertis } = require('./main');

writeProjectPropertis().catch(e => {
  throw e;
});
