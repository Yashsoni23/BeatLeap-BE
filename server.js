const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');
const bodyParser = require('body-parser');
const spotifyWebApi = require('spotify-web-api-node');
const dotenv = require('dotenv').config();

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/login', (req, res, next) => {
    const code = req.body.code;
    console.log(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET);
    const spotifyWebAPI = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET
    });


    spotifyWebAPI.authorizationCodeGrant(code)
        .then((data) => {
            console.log(data);
            res.json({
                access_token: data.body.access_token,
                refresh_token: data.body.refresh_token,
                expires_in: data.body.expires_in
            });
            // return spotifyWebAPI.setAccessToken(data.body.access_token);
        })
        .catch((err) => {
            console.log(err);
            // res.send(err);
            return res.status(500).send(err);
        })
})


app.post("/refresh", (req, res, next) => {
    console.log("hi");
    const refresh_token = req.body.refreshToken;
    console.log(refresh_token, "refresh_token");
    const spotifyWebAPI = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        refreshToken: refresh_token
    });

    spotifyWebAPI.refreshAccessToken().then((data) => {
        res.json({
            access_token: data.body.access_token,
            refresh_token: data.body.refresh_token,
            expires_in: data.body.expires_in
        });
    });
});
app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
