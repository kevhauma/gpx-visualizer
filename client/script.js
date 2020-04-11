let data;
let drawableData;
let counter = 0;
let padding = 20;
let i = 0;
let w = window.innerWidth;
let h = window.innerHeight;

async function setup() {

    colorMode(HSB);
    createCanvas(w, h);
    background(255);
    let start = Date.now();

    data = await (await fetch(`/data`)).json();
    
//    let minLats = []
//    data.forEach(set=>{
//        let lats = set.points.map(p=>p.lat)
//        Math.min(...lats)
//    })
    
    let minLat = Math.min(...data.map(set => Math.min(...set.points.map(p => p.lat))));
    let maxLat = Math.max(...data.map(set => Math.max(...set.points.map(p => p.lat))));

    let minLon = Math.min(...data.map(set => Math.min(...set.points.map(p => p.lon))));
    let maxLon = Math.max(...data.map(set => Math.max(...set.points.map(p => p.lon))));



    let deltaLat = maxLat - minLat;
    let deltaLon = maxLon - minLon;

    let wRatio = w / deltaLon;
    let hRatio = h / deltaLat;
    let ratio = wRatio < hRatio ? wRatio : hRatio;

    let maxWidth = (deltaLon * ratio) - padding
    let maxHeight = (deltaLat * ratio) - padding


    data = data.map(set => {
        let newPoints = set.points.map(p => {
            let newP = {
                x: (map(p.lon, minLon, maxLon, padding, maxWidth)).toFixed(2),
                y: (map(p.lat, minLat, maxLat, maxHeight, padding)).toFixed(2),
                date: p.date
            };
            return newP;
        });
        return {
            name: set.name,
            points: newPoints,
            date: set.date
        };
    });
    drawableData = data.sort((a, b) => a.points[0].date > b.points[0].date);
}

function mousePressed() {

}

function draw() {
    if (!drawableData) return;
    stroke(0);
    line(0, w, 0, h);
    strokeWeight(1);
    let points;
    if (frameCount % 3 === 0) {
        points = drawableData.shift().points
    }
    if (!points) return
    let prevP = points.shift();
    for (let p of points) {
        line(prevP.x, prevP.y, p.x, p.y);
        prevP = p;
    }


}
