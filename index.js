let convert = require('./GPXtoPoints')
let express = require("express");
let bodyParser = require("body-parser");
let opn = require('opn');
let fs = require('fs');

let app = express();

app.use(express.static('client'));

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


function getData() {
    return new Promise((res, rej) => {
        fs.readdir("./gpx/", async (err, files) => {
            let gpxs = []
            files.filter(f => f.endsWith(".gpx"))
                .forEach(f => {
                    
                    let gpxString = fs.readFileSync(`./gpx/${f}`)
                    gpxs.push(gpxString)
                })
            console.log(`converted ${gpxs.length} sets`)
            res(await convert(gpxs))            
        })
    })
}



app.get('/data', async (req, res) => {
        res.status(200).json(await getData());
    
});

app.listen(3000, () => {
    console.log("listening on 3000")
    console.log("opening browser")
    opn('http://localhost:3000');
});
