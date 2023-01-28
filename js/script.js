var img = new Image();
var pageWidth = getWidth();
var displayCanvas;
var displayCtx;
var outputCanvas;
var outputCtx
var imageReceived = false;

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
    imageReceived = true;
};
function failed() {
    console.error("An error occurred when processing the input image");
    alert("Input error");
};

// Image processing algorithms

function generate() {
    if (imageReceived) {
        outputCanvas = document.getElementById('outputCanvas');
        outputCanvas.width = displayCanvas.width;
        outputCanvas.height = displayCanvas.height;

        if (checkInput() == "removeRed") {
            // Remove Red Algorithm
        } else if (checkInput() == "removeGreen") {
            // Remove Green Algorithm
        } else if (checkInput() == "removeBlue") {
            // Remove Blue Algorithm
        } else {
            alert("Invalid Selection");
        }

        setOutputVisibility(true);
    } else {
        alert("Please Upload a Valid Image");
    }
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

// Citing getWidth from https://stackoverflow.com/questions/1038727/how-to-get-browser-width-using-javascript-code 
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