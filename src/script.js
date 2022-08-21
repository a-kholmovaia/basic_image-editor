const canvas = document.getElementById("canvas")
const br = document.getElementById("brightness");
const contr = document.getElementById("contrast");
const alpha = document.getElementById("transparent");
const uploadObj = document.getElementById("file-input");
const saveButton = document.getElementById("save-button");
const image = new Image();
let initialPixels;

const truncate = (number) => (number < 0 ? 0 : number > 255 ? 255 : number);
let ctx = canvas.getContext("2d");

// ==== Listeners =====
uploadObj.addEventListener("change", function(event) {
    if (event.target.files) {
        let file = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function(e) {
            var image = new Image();
            image.src = e.target.result;
            image.onload = function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                var wrh = image.width / image.height;
                var newWidth = canvas.width;
                var newHeight = newWidth / wrh;
                if (newHeight > canvas.height) {
                    newHeight = canvas.height;
                    newWidth = newHeight * wrh;
                }
                ctx.drawImage(image,0,0, newWidth , newHeight);
                let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                initialPixels = imageData.data;
            }
        }
    }
})
contr.addEventListener("change", function() {adjust()});
br.addEventListener("change", function() {adjust()});
alpha.addEventListener("change", function() {adjust()});
saveButton.addEventListener("click", function () {saveImg()});

function adjust() {
    let brightness = parseInt(br.value);
    let contrast = parseInt(contr.value);
    let transparent = parseFloat(alpha.value);

    ctx.drawImage(image, 0, 0);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imageData.data;
    pixels.set(initialPixels);
    let factor = 259 * (255 + contrast) / (255 * (259 - contrast));

    for (let i = 3; i < pixels.length; i += 4) {
        for (let j = 1; j < 4; j++) {
            pixels[i-j] = truncate(factor * (pixels[i-j] - 128) + 128 + brightness);
        }
        pixels[i] *= transparent;
    }
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);
}

function saveImg(){
    var image = canvas.toDataURL();

    var tmpLink = document.createElement( 'a' );
    tmpLink.download = 'result.png'; // set the name of the download file
    tmpLink.href = image;

    document.body.appendChild( tmpLink );
    tmpLink.click();
    document.body.removeChild( tmpLink );
}
