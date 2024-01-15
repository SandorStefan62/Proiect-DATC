const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { run } = require('./db.js');
const { authRouter } = require('./routes/auth.js');
const { allergenRouter } = require('./routes/allergen.js');
const { userRouter } = require('./routes/user.js');

require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/allergen', allergenRouter);

app.listen(port, () => {
    console.log(`Api is listening on port: ${port}`);
    run().catch(error => {
        console.error(`Error starting the api: ${error}`);
    })
});