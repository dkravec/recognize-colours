dataURL = "";
currentIMG = false
doneAllColours = false
allColours = []

onmousemove = function(e){
    const xLocation = e.clientX
    const yLocation = e.clientY

    trackMouse(xLocation, yLocation)
}

// updated nov 14 2022
// document.onload(()=> {
//     document.getElementById("imageFile").addEventListener(evt =>{
//         files = evt.target.files;

//         var file = files[0];

//         if (file) {
//             var reader = new FileReader();
//             reader.onload = function(e) {
//                 document.getElementById('preview').src = e.target.result;
//                 ResizeImage();
//             };
//             reader.readAsDataURL(file);
//         }
//     })
// })
// updated nov 14 2022

$(document).ready(function() {
    $('#imageFile').change(function(evt) {
        files = evt.target.files;

        var file = files[0];

        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('preview').src = e.target.result;
                ResizeImage();
            };
            reader.readAsDataURL(file);
            console.log(file)
        }
    });
});


function ResizeImage() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var filesToUploads = document.getElementById('imageFile').files;
        var file = filesToUploads[0];
        if (file) {
            var reader = new FileReader();
            console.log(reader)

            // Set the image once loaded into file reader
            reader.onload = function(e) {
 
                var img = document.createElement("img");
                img.src = e.target.result;
 
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
 
                var MAX_WIDTH = 300;
                var MAX_HEIGHT = 300;
                var width = img.width;
                var height = img.height
               
                var newCanvasWidth = 300
                var differenceHeightWidthIMG = width / height

                var newCanvasHeight = newCanvasWidth / differenceHeightWidthIMG

                doneAllColours = false
                canvas.width = newCanvasWidth;
                canvas.height = newCanvasHeight;
                document.getElementById("canvas").width=newCanvasWidth
                document.getElementById("canvas").height=newCanvasHeight

                currentIMG = true

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

                canvas.width = width;
                canvas.height = height;

                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
 
                dataurl = canvas.toDataURL(file.type);
                
                document.getElementById('preview').src = dataurl;

                
                setTimeout(function(){ addImage(); }, 1000);
            }
            reader.readAsDataURL(file);
        }
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
}

function getAllColours() {
    if (doneAllColours) return
    document.getElementById("AllColours").innerHTML = ("<u>Please wait...</u>")

    doneAllColours = true
    allColours = []
    var canvas = document.getElementById('canvas');
    var c = canvas.getContext('2d');

    const width = canvas.width
    const height = canvas.height
    currentWidth = 0
    currentHeight = 0

    for (indexX = 0; indexX < width; indexX++) {
        for (indexY = 0; indexY < height; indexY++) {
            var p = c.getImageData(indexX, indexY, 1, 1).data; 
            const data = {
                "r" : p[0],
                "g" : p[1],
                "b" : p[2],
                "x" : indexX,
                "y" : indexY
            }
            console.log(data)
            //allColours.push(data)
        }
    }

    document.getElementById("AllColours").innerHTML = `
        <u>Found Total of ${allColours.length} Colours</u>
        <ul class="all-colours">
            ${allColours.map(function(colour) {
                return `
                    <li class="colour">
                        <p>rgb(${colour.r}, ${colour.g}, ${colour.b}) x value: ${colour.x}, y value: ${colour.y}</p>
                    </li>
                `
            }).join(" ")}
        </ul>
    `
}

canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d'); 
img = document.getElementById('testImage'); 
ctx.drawImage(img, 0, 0);
imageData = ctx.getImageData(0, 0, canvas.width, 300);
data = imageData.data;

function addImage(){
    document.getElementById('testImage').src= dataurl;
    if (dataURL == ""){
        doneAllColours = false

        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d'); 
        img = document.getElementById('testImage'); 
        ctx.drawImage(img, 0, 0);
        imageData = ctx.getImageData(0, 0, canvas.width, 300);
        data = imageData.data; 

    } else{
        canvas=document.getElementById("canvas");
        ctx=canvas.getContext("2d");
        img = document.getElementById('testImage'); 
        elementImg = document.getElementById("newImg");

        imgHight = elementImg.clientHeight;   
        imgWidth = elementImg.clientWidth;   
        
        ctx.drawImage(img,0,0,img.width,img.height,0,0,imgWidth,imgHight);
        dataURL="";
    }

    imageData = ctx.getImageData(0, 0, canvas.width, 300);
    data = imageData.data;
}

colorList=[]
newColor=0;

function trackMouse(x, y){
    var canvas = document.getElementById('canvas');
    var c = canvas.getContext('2d');
    var p = c.getImageData(x, y, 1, 1).data; 
    document.getElementById("currentMouseTrace").innerHTML = `Mouse Tracking: x=${x}, y=${y}` 
    document.getElementById("currentCanvasSize").innerHTML = `Canvas Size: width=${canvas.width}, height=${canvas.height}}`
    canvasData = document.getElementById("canvas");


    if (x > canvasData.width) return resetCurrentColour()
    if (y > canvasData.height) return resetCurrentColour()
    
    img = document.getElementById('img'); 

    newColor=0;

    changeBackground(p[0], p[1], p[2])
}

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


  
function clickMe(){
    elementImg = document.getElementById("fullBody");
    elementImg.innerHTML = "<img id='newImg' src='"+dataURL+"' class='newImg'>"
    dataurl=dataURL;

    setTimeout(function(){ addImage(); }, 1000);
}

(function ($) {
    var defaults;
    $.event.fix = function (originalFix) {
        return function (event) {
        event = originalFix.apply(this, arguments);
        if (event.type.indexOf("copy") === 0 || event.type.indexOf("paste") === 0) {
            event.clipboardData = event.originalEvent.clipboardData;
        }
        return event;
        };
    }($.event.fix);

    defaults = {
        callback: $.noop,
        matchType: /image.*/ 
    };

    return $.fn.pasteImageReader = function (options) {

        if (typeof options === "function") {
        options = {
            callback: options };

        }
        options = $.extend({}, defaults, options);

        return this.each(function () {
            var $this, element;
            element = this;
            $this = $(this);
            return $this.bind("paste", function (event) {
                var clipboardData, found;
                found = false;
                clipboardData = event.clipboardData;
                
                return Array.prototype.forEach.call(clipboardData.types, function (type, i) {
                    var file, reader;
                    if (found) {
                        return;
                    }
                    if (
                    type.match(options.matchType) ||
                    clipboardData.items[i].type.match(options.matchType))
                    {
                        file = clipboardData.items[i].getAsFile();
                        reader = new FileReader();
                        reader.onload = function (evt) {
                        return options.callback.call(element, {
                            dataURL: evt.target.result,
                            event: evt,
                            file: file,
                            name: file.name });

                        };
                        reader.readAsDataURL(file);
                    
                        return found = true;
                    }
                });
            });
        });
    }; 
    
})(jQuery);

var dataURL, filename;

$("html").pasteImageReader(function (results) {
    filename = results.filename, dataURL = results.dataURL;
    var img = document.createElement("img");
    img.src = dataURL;
    clickMe(); 
});