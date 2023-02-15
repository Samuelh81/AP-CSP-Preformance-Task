var img = new Image();
var pageWidth = getWidth();
var displayCanvas;
var displayCtx;
var outputCanvas;
var outputCtx;
var imageReceived = false;
var imageDimensions = new Map();
var recentFilter;
var filters = new Map();
    filters.set("removeRed", "Remove Red");
    filters.set("removeGreen", "Remove Green");
    filters.set("removeBlue", "Remove Blue");
    filters.set("invert", "Invert Colors");
    filters.set("randomInvert", "Randomly Invert Colors");
    filters.set("removeRed", "Remove Red");
    filters.set("shift1", "1 Shift");
    filters.set("shift2", "2 Shift");
    filters.set("makeGray", "Convert to Grayscale");
    filters.set("static", "Add Static");
    filters.set("noise", "Make Noisy");
    filters.set("transparent", "Make White Transparent");
    filters.set("randomDelete", "Randomly Delete");

document.getElementById('imageUpload').onchange = function() {
    img.onload = draw;
    img.onerror = failed;
    img.src = URL.createObjectURL(this.files[0]);
};
function draw() {
    displayCanvas = document.getElementById('displayCanvas');
    // 'this' references the uploaded image
    displayCanvas.width = this.width;
    displayCanvas.height = this.height;
    displayCtx = displayCanvas.getContext('2d', {willReadFrequently: true});
    displayCtx.drawImage(this, 0, 0, this.width, this.height);
    imageDimensions.set("height", displayCanvas.height);
    imageDimensions.set("width", displayCanvas.width);
    imageDimensions.set("pixels", displayCanvas.width * displayCanvas.height);
    imageReceived = true;
    if (imageDimensions.get("pixels") >= 465000) {
    alert("Large image detected. Processing may take some time.");
    }
};
function failed() {
    console.error("An error occurred when processing the input image");
    alert("Input error");
};

// Image processing algorithms

function generate() {
    if (imageReceived) {
        outputCanvas = document.getElementById('outputCanvas');
        outputCtx = outputCanvas.getContext('2d');
        outputCanvas.width = displayCanvas.width;
        outputCanvas.height = displayCanvas.height;
        setOutputVisibility(true);
        primitiveAlgorithm(checkInput());
    } else {
        alert("Please Upload a Valid Image");
    }
}

// For the purposes of this program, a primitive algorithm
// is defined as an algorithm that modifies pixel values 
// based solely on the original value of that one pixel.
function primitiveAlgorithm(mode) {
    for (var x=0; x<imageDimensions.get("width"); x++) {
        for (var y=0; y<imageDimensions.get("height"); y++) {
                var px = getPixelData(x,y);
                var r = px.red;
                var g = px.green;
                var b = px.blue;
                var a = px.alpha;
                if (mode == "removeRed") {
                    if (!(a == 0)) {
                        outputCtx.fillStyle = format(0, g, b, a);
                        outputCtx.fillRect(x,y,1,1);
                    }
                } else if (mode == "removeGreen") {
                    if (!(a == 0)) {
                        outputCtx.fillStyle = "rgba("+r+","+0+","+b+","+a+")";
                        outputCtx.fillRect(x,y,1,1);
                    }
                } else if (mode == "removeBlue") {
                    if (!(a == 0)) {
                        outputCtx.fillStyle = "rgba("+r+","+g+","+0+","+a+")";
                        outputCtx.fillRect(x,y,1,1);
                    }
                } else if (mode == "makeGray") {
                    if (!(a == 0)) {
                        var gray = (r+g+b)/3
                        outputCtx.fillStyle = "rgba("+gray+","+gray+","+gray+","+a+")";
                        outputCtx.fillRect(x,y,1,1);
                    }
                } else if (mode == "invert") {
                    if (!(a == 0)) {
                        outputCtx.fillStyle = format((255-r), (255-g), (255-b), a);
                        outputCtx.fillRect(x,y,1,1);
                    }
                } else if (mode == "static") {
                    if (!(a == 0)) {
                        var rand = Math.random();
                        outputCtx.fillStyle = format(r*rand, g*rand, b*rand, a*rand);
                        outputCtx.fillRect(x,y,1,1);
                    }
                } else if (mode == "shift1") {
                    if (!(a == 0)) {
                        outputCtx.fillStyle = format(b, r, g, a);
                        outputCtx.fillRect(x,y,1,1);
                    }
                } else if (mode == "shift2") {
                    if (!(a == 0)) {
                        outputCtx.fillStyle = format(g, b, r, a)
                        outputCtx.fillRect(x,y,1,1);
                    }
                } else if (mode == "randomInvert") {
                    if (!(a == 0)) {
                        var rand = Math.random();
                        if (rand > 0.5) {
                            outputCtx.fillStyle = format((255-r), (255-g), (255-b), a);
                            outputCtx.fillRect(x,y,1,1);
                        } else {
                            outputCtx.fillStyle = format(r, g, b, a);
                            outputCtx.fillRect(x,y,1,1);
                        }
                    }
                } else if (mode == "noise") {
                    if (!(a == 0)) {
                        var rand = Math.random() * (1 - .75) + .75;
                        outputCtx.fillStyle = format(r*rand, g*rand, b*rand, a*rand);
                        outputCtx.fillRect(x,y,1,1);
                    }
                } else if (mode == "transparent") {
                    if (!(a == 0)) {
                        if ((r+g+b)>=725) {
                            outputCtx.fillStyle = format(0, 0, 0, 0);
                            outputCtx.fillRect(x,y,1,1);
                        } else {
                            outputCtx.fillStyle = format(r, g, b, a);
                            outputCtx.fillRect(x,y,1,1);
                        }
                    }
                } else if (mode == "randomDelete") {
                   if (!(a == 0)) {
                        var rand = Math.random();
                        if (rand > 0.5) {
                            outputCtx.fillStyle = format(0, 0, 0, 0);
                            outputCtx.fillRect(x,y,1,1);
                        } else {
                            outputCtx.fillStyle = format(r, g, b, a);
                            outputCtx.fillRect(x,y,1,1);
                        }
                   } 
                }
        }
    }
    recentFilter = checkInput();
}

function advancedAlgorithm(mode) {
    // Advanced Algorithms
    let kernel = [
        [1, 2, 1],
        [2, 4, 2],
        [1, 2, 1]
    ];
}

// Misc

function setOutputVisibility(show) {
    if (show) {
        document.getElementById('outputContents').style.visibility = "visible";
    } else {
        document.getElementById('outputContents').style.visibility = "hidden";
    }
}

function checkInput() {
        var selected = document.getElementById('type').value;
        return selected;
}

function getPixelData(x,y) {
    var imageData = displayCtx.getImageData(x,y,1,1);
    var red = imageData.data[0];
    var green = imageData.data[1];
    var blue = imageData.data[2];
    var alpha = imageData.data[3];
    return { red,green,blue,alpha }
}

function download() {
  var image = outputCanvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
  var link = document.createElement('a');
  link.download = "{" + filters.get(recentFilter) + "} " + document.getElementById("imageUpload").files.item(0).name;
  link.href = image;
  link.click();
}

function format(r,g,b,a) {
    return "rgba("+r+","+g+","+b+","+a+")";
}

// Citing getWidth 
// from https://stackoverflow.com/questions/1038727/how-to-get-browser-width-using-javascript-code 
function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}
// End cited code