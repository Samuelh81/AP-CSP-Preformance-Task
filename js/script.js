var img = new Image();
var pageWidth = getWidth();
var displayCanvas;
var displayCtx;
var outputCanvas;
var outputCtx;
var imageReceived = false;
var imageDimensions = new Map();
var recentFilter;

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
        if (checkInput() == "removeRed") {
            primitiveAlgorithm("removeRed");
        } else if (checkInput() == "removeGreen") {
            primitiveAlgorithm("removeGreen");
        } else if (checkInput() == "removeBlue") {
            primitiveAlgorithm("removeBlue");
        } else  if (checkInput() == "makeGray") {
            primitiveAlgorithm("makeGray")
        } else if (checkInput() == "invert") {
            primitiveAlgorithm("invert");
        } else if (checkInput() == "static") {
            primitiveAlgorithm("static");
        } else if (checkInput() == "shift") {
            primitiveAlgorithm("shift");
        } else if (checkInput() == "randomInvert") {
            primitiveAlgorithm("randomInvert");
        } else if (checkInput() == "noise") {
            primitiveAlgorithm("noise");
        }
    } else {
        alert("Please Upload a Valid Image");
    }
}

// For the purposes of this program, a primitive algorithm
// is defined as an algorithm that modifies pixel values 
// based solely on the original value of that one pixel.
function primitiveAlgorithm(mode) {
    for (var x=0;x<imageDimensions.get("width");x++) {
        for (var y=0;y<imageDimensions.get("height");y++) {
                var px = getPixelData(x,y);
                var r = px.red;
                var g = px.green;
                var b = px.blue;
                var a = px.alpha;
                if (mode == "removeRed") {
                    if (!(a == 0)) {
                        outputCtx.fillStyle = "rgba("+0+","+g+","+b+","+a+")";
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
                        outputCtx.fillStyle = "rgba("+(255-r)+","+(255-g)+","+(255-b)+","+a+")";
                        outputCtx.fillRect(x,y,1,1);
                    }
                } else if (mode == "static") {
                    if (!(a == 0)) {
                        var rand = Math.random();
                        outputCtx.fillStyle = "rgba("+r*rand+","+g*rand+","+b*rand+","+a*rand+")";
                        outputCtx.fillRect(x,y,1,1);
                    }
                } else if (mode == "shift") {
                    if (!(a == 0)) {
                        outputCtx.fillStyle = "rgba("+b+","+r+","+g+","+a+")";
                        outputCtx.fillRect(x,y,1,1);
                    }
                } else if (mode == "randomInvert") {
                    var rand = Math.random();
                    if (rand > 0.5) {
                        outputCtx.fillStyle = "rgba("+(255-r)+","+(255-g)+","+(255-b)+","+a+")";
                        outputCtx.fillRect(x,y,1,1);
                    } else {
                        outputCtx.fillStyle = "rgba("+r+","+g+","+b+","+a+")";
                        outputCtx.fillRect(x,y,1,1);
                    }
                } else if (mode == "noise") {
                    if (!(a == 0)) {
                        var rand = Math.random() * (1 - .75) + .75;
                        outputCtx.fillStyle = "rgba("+r*rand+","+g*rand+","+b*rand+","+a*rand+")";
                        outputCtx.fillRect(x,y,1,1);
                    }
                }
        }
    }
    recentFilter = checkInput();
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

function download() {
  var image = outputCanvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
  var link = document.createElement('a');
  link.download = recentFilter + " " + document.getElementById("imageUpload").files.item(0).name;
  link.href = image;
  link.click();
}
