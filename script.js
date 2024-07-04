const images = [

]
var imageCount = 0

document.getElementById('submitFile').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const input = document.getElementById('imageFile');
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();
        resetImageData()

        reader.onload = function(e) {
            const imageUrl = e.target.result;
            const imgElement = document.getElementById('preview');
            // imgElement.src = imageUrl;
            imgElement.style.display = 'block';
            
            // Further processing of the image can be done here
            console.log('Image successfully uploaded and displayed.');
            const img = new Image();

            img.onload = function() {
                const resizeData = getNewCanvasSize(img.width, img.height);

                const currentImage = imageCount;
                images.push({
                    num: currentImage,
                    img: img,
                    colours: false,
                    colourData: [],
                    resizeData: resizeData
                });
                imageCount++;
                // images[currentImage].resizeData = resizeData;
                drawCanvas(images[currentImage]);
            };

            img.src = imageUrl;
        };

        reader.readAsDataURL(file);
    } else {
        alert('Please select an image file.');
    }
});

function resetImageData() {
    document.getElementById("processing").innerHTML = ""
    document.getElementById("AllColours").innerHTML = ""
    document.getElementById("currentMouseTrace").innerHTML = ""
    document.getElementById("currentCanvasSize").innerHTML = ""
    document.getElementById("fullImageSize").innerHTML = ""
    document.getElementById("currentColour").innerHTML = ""
}

function drawCanvas(imageData) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    document.getElementById("canvas").width=imageData.resizeData.newCanvasWidth
    document.getElementById("canvas").height=imageData.resizeData.newCanvasHeight
    ctx = canvas.getContext("2d");

    document.getElementById("currentCanvasSize").innerHTML = `Canvas Size: width=${imageData.resizeData.newCanvasWidth}, height=${imageData.resizeData.newCanvasHeight}`
    document.getElementById("fullImageSize").innerHTML = `width=${imageData.resizeData.imgWidth}, height= ${imageData.resizeData.imgHeight}`
    // Draw the image on the canvas
    ctx.drawImage(imageData.img, 0, 0, canvas.width, canvas.height);
}

function getNewCanvasSize(width, height) {
    const OGWidth=width
    const OGHeight=height
    var MAX_WIDTH = 300;
    var MAX_HEIGHT = 300;

    var newCanvasWidth = Math.floor(MAX_WIDTH)
    var differenceHeightWidthIMG = width / height

    var newCanvasHeight = Math.floor(newCanvasWidth / differenceHeightWidthIMG)

    if (width > height) {
        if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
        }
    } else {
        if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
        }
    }

    console.log(`width=${width}, height=${height}`)
    console.log(`newCanvasWidth=${newCanvasWidth}, newCanvasHeight=${newCanvasHeight}`)
    
    const resizeData = {
        width: width,
        height: height,
        newCanvasWidth,
        newCanvasHeight,
        imgWidth: OGWidth,
        imgHeight: OGHeight,
        differenceHeightWidthIMG
    };

    return resizeData;
}

function getAllColours() {
    const AllColours = document.getElementById("AllColours");
    AllColours.innerHTML = ("<u>Please wait...</u>")
    const currentImage = images[images.length - 1]
    if (currentImage.colours) return AllColours.innerHTML = ("<u>colours already found...</u>")
    if (currentImage.colourData.length > 0) return AllColours.innerHTML = ("<u>colour data found already..</u>")
    if (currentImage.img === undefined) return AllColours.innerHTML = ("<u>no image data found...</u>")

    var canvas = document.getElementById('canvas');
    var c = canvas.getContext('2d');

    const allColours = []

    const width = currentImage.resizeData.newCanvasWidth
    const height = currentImage.resizeData.newCanvasHeight

    currentWidth = 0
    currentHeight = 0

    for (indexX = 0; indexX < width; indexX++) {
        console.log(`Processing: ${indexX} / ${width}`)

        if (indexX % 10 === 0 || indexX === width-1) {
            document.getElementById("processing").innerHTML = `Processing: ${indexX} / ${width}`
            console.log(`Processing: ${indexX} / ${width}`)
        }

        for (indexY = 0; indexY < height; indexY++) {
            var p = c.getImageData(indexX, indexY, 1, 1).data; 
            const SCALING = 10;
            const data = {
                "r" : Math.floor(p[0] / SCALING) * SCALING,
                "g" : Math.floor(p[1] / SCALING) * SCALING,
                "b" : Math.floor(p[2] / SCALING) * SCALING,
                "x" : indexX,
                "y" : indexY
            }

            allColours.push(data)
        }
    }

    const uniqueColours = [];
    const colorSet = new Set();

    // Remove duplicate colours
    allColours.forEach(color => {
        const colorString = `${color.r},${color.g},${color.b}`;
        if (!colorSet.has(colorString)) {
            colorSet.add(colorString);
            uniqueColours.push(color);
        }
    });

    const amountColours = uniqueColours.length;
    var currentColour=0;
    var str = ""
    
    uniqueColours.map(function(colour) {
        currentColour++
        if (currentColour % 10 === 0 || currentColour === amountColours) {
            document.getElementById("processing").innerHTML = `Processing: ${currentColour} / ${amountColours}`
            console.log(`Processing: ${currentColour} / ${amountColours}`)
        }

        str+=`
            <li class="colour">
                <p style="color: rgb(${colour.r}, ${colour.g}, ${colour.b})">rgb(${colour.r}, ${colour.g}, ${colour.b})</p>
            </li>
        `
    });

    document.getElementById("AllColours").innerHTML = `
        <u>Found Total of ${uniqueColours.length} Unique Colours</u>
        <ul class="all-colours">${str}</ul>
    `
}

canvas.addEventListener('mousemove', function(event) {
    // You can add code here to handle mouse move over the canvas
    var canvas = document.getElementById('canvas');
    var c = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(event.clientX - rect.left);
    const y = Math.floor(event.clientY - rect.top);

    var p = c.getImageData(x, y, 1, 1).data; 

    document.getElementById("currentMouseTrace").innerHTML = `Mouse Tracking: x=${x}, y=${y}` 
    document.getElementById("currentCanvasSize").innerHTML = `Canvas Size: width=${canvas.width}, height=${canvas.height}`

    changeBackground(p[0], p[1], p[2])

    // console.log('Mouse Move:', x, y);
});

canvas.addEventListener('mouseleave', function(event) {
    // console.log('Mouse Leave');
    return resetCurrentColour()
});

function changeBackground(r, g, b){
    const currentColor = `rgb(${r}, ${g}, ${b})`;

    var colourPreview = document.getElementById('colourPreview')

    colourPreview.style.height = "150px"
    colourPreview.style.width = "150px"
    colourPreview.style.backgroundColor = currentColor;

    const colourHex = convertColourRGBtoHEX(r, g, b)

    document.getElementById("currentColour").innerHTML = ` 
        <u>Colour Codes</u>
        <p>${currentColor}</p>
        <p>${colourHex}</p>
    `
}
function resetCurrentColour() {
    var colourPreview = document.getElementById('colourPreview')

    colourPreview.style.height = "0px"
    colourPreview.style.width = "0px"
    colourPreview.style.backgroundColor = "transparent";

    document.getElementById("currentColour").innerHTML = ``
}

function convertColourRGBtoHEX(red,green,blue) {
    if(red < 0 || red > 255) return alert("r is out of bounds; " + red);
    if(green < 0 || green > 255) return alert("g is out of bounds; " + green);
    if(blue < 0 || blue > 255) return alert("b is out of bounds; " + blue);

    const rgb = (red << 16) | (green << 8) | (blue << 0);

    return '#' + (0x1000000 + rgb).toString(16).slice(1);
}
