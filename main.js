// Getting Canvas
var c = document.getElementById("my-canvas");
var ctx = c.getContext("2d");

// Function for load Image
let loadImage = (src, callback) => {
    let img = document.createElement("img");
    img.onload = () => callback(img);
    img.src = src;
};

//Gets Image Path
let imagePath = (frameNumber,aniamtion) => {
    return "/images/" + aniamtion + "/"+ frameNumber + ".png";
};

// Defines Lists of all actions
let frames = {
    idle:[1,2,3,4,5,6,7,8],
    kick:[1,2,3,4,5,6,7],
    punch:[1,2,3,4,5,6,7],
    forward:[1,2,3,4,5,6],
    backward:[1,2,3,4,5,6],
    block:[1,2,3,4,5,6,7,8,9],
};

// Loads Image Based On the Action Given
let loadImages = (callback) => {

    let images = {idle:[],kick:[],punch:[],forward:[],backward:[],block:[]};
    let imagesToLoad = 0;
    ["idle","kick","punch","forward","backward","block"].forEach(animation => {
        let animationFrames = frames[animation];

        imagesToLoad = imagesToLoad + animationFrames.length;

        animationFrames.forEach((frameNumber) => {

            let path = imagePath(frameNumber, animation);

            loadImage(path, (image) => {
                images[animation][frameNumber - 1] = image;
                imagesToLoad = imagesToLoad - 1;
    
                if(imagesToLoad == 0)
                {
                    callback(images);
                }
    
            });
        });
        })
};

// Variable for X Coordinate
let x_cord = 10;

// Aniamtes the Action Given
let animate = (ctx, images, animation, callback) => {
    images[animation].forEach((image,index) => {
        setTimeout(() => {
            ctx.clearRect(0,0,1000,500);
            var background = new Image();
            background.src = "/images/background.jpg";
            ctx.drawImage(background,0,0,1000,500); 
            var dummy = new Image();
            dummy.src = "/images/dummy.png";
            ctx.drawImage(dummy,770,195,300,300);   
            if(animation=="forward" && x_cord <= 568)
            {
                x_cord += 10;
            }
            else if(animation=="backward" && x_cord > 10)
            {
                x_cord -= 10;
            }
            else if(animation=="punch")
            {
                var snd = new Audio("/sounds/punch.wav");
                snd.play();
            }
            else if(animation=="kick")
            {
                var snd = new Audio("/sounds/kick.wav"); 
                snd.play();
            }
            ctx.drawImage(image,x_cord,85,400,400);
        }, index * 100);
    });
    setTimeout(callback,images[animation].length *100);
};


// Main Function for loading images based on key or button pressed
loadImages((images) => {

    let queuedAnimations = [];

    let aux = () => {
        let selectedanimation;

        if(queuedAnimations.length === 0)
        {
            selectedanimation = "idle";
        }
        else
        {
            selectedanimation = queuedAnimations.shift();
        }

        animate(ctx,images,selectedanimation,aux);
    };

    aux();

    document.getElementById("kick").onclick = () => {
        queuedAnimations.push("kick");
    };

    document.getElementById("punch").onclick = () => {
        queuedAnimations.push("punch");
    };

    document.getElementById("forward").onclick = () => {
        queuedAnimations.push("forward");
    };

    document.getElementById("backward").onclick = () => {
        queuedAnimations.push("backward");
    };

    document.getElementById("block").onclick = () => {
        queuedAnimations.push("block");
    };
    
    document.addEventListener("keyup", (event) => {
        const key = event.key;

        if(key  == "ArrowDown"){
            queuedAnimations.push("kick");
        }
        else if(key == "ArrowUp"){
            queuedAnimations.push("punch");
        }
        else if(key == "ArrowRight"){
            queuedAnimations.push("forward");
        }
        else if(key == "ArrowLeft"){
            queuedAnimations.push("backward");
        }
        else if(key == "X" || key == "x"){
            queuedAnimations.push("block");
        }

    })

});