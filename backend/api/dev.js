const app = require('./index.js');

const port = Number(process.env.PORT || 3010);

app.listen(port, '0.0.0.0', () => {
  console.log(`API dev server listening on http://0.0.0.0:${port}`);
});
