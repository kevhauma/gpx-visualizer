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


let pointSets

fs.readdir("./gpx/", async (err, files) => {
    let gpxs = []
    files.filter(f => f.endsWith(".gpx"))
        .forEach(f => {
            console.log("converting: " + f)
            let gpxString = fs.readFileSync(`./gpx/${f}`)
            gpxs.push(gpxString)
        })
    pointSets = await convert(gpxs) 
    
    
    console.log(`converted ${pointSets.length} sets`)
})

app.get('/data', (req, res) => {
    if (pointSets)
        res.status(200).json(pointSets);
    else
        res.status(500).json("not ready, try again");
});

app.listen(3000, () => {
    console.log("listening on 3000")
    console.log("opening browser")
    opn('http://localhost:3000');
});
