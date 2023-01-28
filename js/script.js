// Canvas init

var img = new Image();
const pageWidth = getWidth();
var canvas;
var ctx;

document.getElementById('imageUpload').onchange = function() {
    img.onload = draw;
    img.onerror = failed;
    img.src = URL.createObjectURL(this.files[0]);
};
function draw() {
    canvas = document.getElementById('displayCanvas');
    // 'this' references image
        canvas.width = this.width;
        canvas.height = this.height;
    ctx = canvas.getContext('2d', {willReadFrequently: true});
    ctx.drawImage(this, 0, 0, this.width, this.height)
};
function failed() {
    console.error("An error occurred when processing the input image");
    alert("Input error");
};

// Image processing algorithms











// Misc

function getPixelData(x,y) {
    var imageData = ctx.getImageData(x,y,1,1);
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