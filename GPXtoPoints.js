let GPX = require('gpx-parse')
let fs = require('fs')

module.exports = convert

async function convert(gpxs) {
    let sets = []
    for (f of gpxs) {
       sets.push(await getKMLPoints(f))
    }
    return sets
}

function getKMLPoints(f) {
    return new Promise((res, rej) => {
        try {
            
            GPX.parseGpx(f, (error, data) => {
                if (error) throw error                
                let filename
                let trackPoints = []
                if (!data) throw ("no data found")
                data.tracks.forEach(t => {
                    if (t.name) filename = t.name
                    t.segments.forEach(seg => {
                        seg.forEach(wp => {
                            trackPoints.push({
                                lat: parseFloat(wp.lat),
                                lon: parseFloat(wp.lon),
                                date: new Date(wp.time)
                            })
                        })
                    })
                })
                let date = trackPoints[0].date
                let name = `${filename.replace(".gpx","")}`
                

                res({
                    points: trackPoints,
                    name,date,
                })
            })
        } catch (e) {
            console.log(`ERROR`)
            console.log(e)
            rej("")
        }
    })
}

function getYYYYMMDD(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}
