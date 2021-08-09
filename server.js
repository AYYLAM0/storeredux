const express = require('express');
const routes = require('./routes');
const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
