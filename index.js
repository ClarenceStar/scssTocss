const express = require("express");
const sass = require("node-sass");
const cssbeautify = require("cssbeautify");

// Start our webservice
const app = express();

// Set some headers to allow access
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});

app.listen(8088, () =>
  console.log("SCSS to CSS converter started on port 8088")
);

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

function SassMe(scss) {
  return sass.renderSync({
    data: scss,
  });
}

app.post("/convert", function (req, res) {
  var scssData = req.body.scss;

  try {
    var result = SassMe(scssData);
    var css = cssbeautify(result.css.toString("utf8"));
    res.send({
      status: 0,
      msg: "转译成功",
      data: css.toString("utf8"),
    });
  } catch (error) {
    res.send({
      status: -1,
      msg: error,
      data: {},
    });
  }
});
