let lineWidth = 1

window.addEventListener("load", init, false)

function init() {
    let lineWidthInput = document.getElementById("lineWidth")
    lineWidthInput.value = lineWidth
    lineWidthInput.addEventListener("change", () => {
        lineWidth = lineWidthInput.value
    })
}
