class Gpx {
    constructor({name,date,points}) {
        this.name = name
        this.date = date
        this.points = points
        this.state = 0
        this.interval = points.length / drawSpeed
        this.currentPointToDraw = 0
    }

    ready() {
        this.state = 1
    }


    draw(percentage) {
        if (!this.state) return
        this.currentPointToDraw += this.interval        
        if (this.currentPointToDraw > this.points.length) {
            this.state = 2
        }

        this.prevP = this.points[0]
        this.points.forEach((p, i) => {
            if(i > this.currentPointToDraw) return
           
            line(this.prevP.x, this.prevP.y, p.x, p.y)
            this.prevP = p
        })
    }
}
