const express = require("express");
const app = express();
const connectDB = require("./config/db");
const { globalErrorHandler } = require("./middleware");
const dotenv = require("dotenv");
dotenv.config();
const server = require("http").createServer(app);
const { PORT } = process.env;
const morgan = require("morgan");
require('./triggers/triggerEvents');
const routes = require("./api/routes/index");
const cors = require('cors');
let multer = require('multer')
let forms = multer()
// middlewares
app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());
// all routes
const passport = require("passport");
// require("./utils/passport")(passport);
const jwt = require('jsonwebtoken');
{/* <em>// Redirect the user to the Google signin page</em>  */}


{/* <em>// Retrieve user data using the access token received</em>  */}

{/* <em>// profile route after successful sign in</em>  */}
connectDB();
app.use(forms.any())
app.get("/profile", (req, res) => {
 console.log(req);
 res.send("Welcome");
});


// Error Handler
app.use(globalErrorHandler);

app.use(routes);
// catch all route
const port = PORT || 8000;
app.all("*", (req, res) => res.status(404).send("Page not found"));
server.listen(port, () => console.log(`Server is running on port ${port}`));
