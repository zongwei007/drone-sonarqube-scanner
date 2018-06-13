const { writeProjectPropertis } = require('./main');

writeProjectPropertis().catch(e => {
  console.error(e);
  throw e;
});
