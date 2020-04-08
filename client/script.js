let data;
let counter = 0;
let i = 0;
let w = window.innerWidth;
let h = window.innerHeight;

async function setup() {
    colorMode(HSB);
    createCanvas(w, h);
    let start = Date.now();

    data = await (await fetch(`/data`)).json();    
    let onlyLat = [...data.map(set => [...set.points.map(p => p.lat)])].flat()
    let onlyLon = [...data.map(set => [...set.points.map(p => p.lon)])].flat()

    const minLat = Math.min(...onlyLat);
    const maxLat = Math.max(...onlyLat);

    const minLon = Math.min(...onlyLon);
    const maxLon = Math.max(...onlyLon);
    
    
    
    data = data.map(set => {
        let newPoints = set.points.map(p => {
            let newP = {                
                x: map(p.lon, minLon, maxLon, 0, w).toFixed(2),
                y: map(p.lat, minLat, maxLat, h, 0).toFixed(2),
                date: p.date
            }            
            return newP
        })
        return {
            name: set.name,
            points: newPoints,
            date: set.date
        }
    })
    data.sort((a, b) => a.points[0].date > b.points[0].date)
}

function mousePressed() {
    //    noLoop()
}

let p = {}

function draw() {
    if (!data) return
    stroke(0)
    line(0,w,0,h)
    strokeWeight(1)
    data.forEach(set => {
        let prevP = set.points.shift()
        for (let p of set.points) {            
            line(prevP.x, prevP.y, p.x, p.y)
            prevP = p
        }
    })
    noLoop()

}
