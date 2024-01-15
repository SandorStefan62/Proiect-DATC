const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { run } = require('./db.js');
const { authRouter } = require('./routes/auth.js');
const { allergenRouter } = require('./routes/allergen.js');
const { userRouter } = require('./routes/user.js');
const { validateRouter } = require('./routes/validateToken.js');

require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

app.use('/api/validate', validateRouter)
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/allergen', allergenRouter);

app.listen(port, () => {
    console.log(`Api is listening on port: ${port}`);
    run().catch(error => {
        console.error(`Error starting the api: ${error}`);
    })
});