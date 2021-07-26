const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(function (req, res, next) {
  res.setHeader(
    'Report-To',
    '{"group":"csp-endpoint","max_age":10886400,"endpoints":[{"url":"http://127.0.0.1:5500/__cspreport__"}],"include_subdomains":true}'
  );

  res.setHeader(
    'Content-Security-Policy-Report-Only',
    "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
  );
  next();
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/__cspreport__', (req, res) => {
  console.log(req.body);
});


app.use(
  bodyParser.json({
    type: ['application/json', 'application/csp-report', 'application/reports+json'],
  })
);

const server = app.listen(process.env.PORT || 5500, () => {
  const { port } = server.address();
  console.log(`Server running on PORT ${port}`);
});