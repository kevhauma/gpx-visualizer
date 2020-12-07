let drawableData;
let drawSpeed = 30;
let counter = 0;
let padding = 20;
let w = window.innerWidth;
let h = window.innerHeight;

let totalRoutes = 150; 
let currentHue = 0;


async function setup() {
    createCanvas(w, h);
    frameRate(60)
    colorMode(HSB)
    background('grey')
    let start = Date.now();

    let data = await (await fetch(`/data`)).json();

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

    let maxWidth = (deltaLon * ratio) - (padding * 2)
    let maxHeight = (deltaLat * ratio) - (padding * 2)

    let left = (w - maxWidth) / 2
    let right = left + maxWidth
    let top = (h - maxHeight) / 2
    let bottom = top + maxHeight

    data = data.map(set => {
        let newPoints = set.points.map(p => {
            let newP = {
                x: (map(p.lon, minLon, maxLon, left, right)).toFixed(2),
                y: (map(p.lat, minLat, maxLat, bottom, top)).toFixed(2),

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

    drawableData = data.sort((a, b) => a.points[0].date > b.points[0].date).map(set => new Gpx(set));

    totalRoutes =  drawableData.length
   
    
}

function mousePressed() {

}
let gpxToDraw = []
let lastDrawn

function draw() {
    //    background('green');
//    background(255);
    if (!drawableData) return;

    if (!lastDrawn || lastDrawn.state == 2) {
        lastDrawn = drawableData.shift()
        if (lastDrawn) {
            lastDrawn.ready()
            gpxToDraw.push(lastDrawn)
        } else {
            noLoop()
        }
    }
        currentHue = map(gpxToDraw.length,0,totalRoutes,0,255)        
        stroke(currentHue,255,255)        
        
        strokeWeight(1);
        lastDrawn.draw()
//    gpxToDraw.forEach(d => {
//        if (d.state == 1) {
//            stroke('red')
//            strokeWeight(3);
//        } else {
//            stroke(0)
//            strokeWeight(lineWidth);
//        }
//
//        d.draw()
//
//
//        if (d.state == 1) {
//            strokeWeight(0)
//            textSize(padding)
//            text(d.name, padding, padding + 20)
//        }
//    })

}
