let canvas,
    capture,
    increment = -1,
    size = 10,
    history_frames = [],
    fullImage,
    direction = 'top-down',
    ideal = [{w:1024,h:576},{w:1280,h:720},];


function preload(){
  // put preload code here
}

function setup() {
  let constraints = {
    audio: false,
    video: {
      width: { min: 360, ideal: ideal[1].w, max: 1280 },
      height: { min: 202, ideal: ideal[1].h, max: 720 },
      frameRate: { min: 12, ideal: 24, max: 24 }
    }
  }
  capture = createCapture(constraints, function(stream) {
    console.log(stream);
  });
  capture.hide();
  frameRate(60)
}

function draw() {
  // put drawing code here
  background('black');

  if (capture.loadedmetadata) {
    // create the canvas as soon as the webcam streaming is loaded
    if (!canvas) {
      canvas = createCanvas(capture.width, capture.height);
      pixelDensity(1);
      fullImage = createImage(width, height);
      fullImage.loadPixels();
      for (let i = 0; i < fullImage.width; i++) {
        for (let j = 0; j < fullImage.height; j++) {
          // fullImage.set(i, j, color(0, 90, 102, 0.01 * (i % fullImage.width) * (j % fullImage.height)));
          fullImage.set(i, j, color(0, 0, 0, 1));
        }
      }
      fullImage.updatePixels();
      console.log(size, capture.loadedmetadata, capture.width, capture.height, capture)
    }

    increment ++;
    if (increment >= (height/size)) { increment = 0; }

    // store frames in history_frames
    history_frames.push(capture.get(0, 0, width, height));
    if (history_frames.length > height/size) {
      let removed_frame = history_frames.shift();
    }
    history_frames[history_frames.length-1].loadPixels();

    if (history_frames.length == height/size || true) {
      // Create the time displaced fullImage
      fullImage.loadPixels();

      switch (direction) {
        case 'bottom-up':
          for (var count = 0; count < history_frames.length; count++) {
            let frame = history_frames[count]
            let offset = count * width * size * 4;
            for (var i = offset; i < offset + size*4*width; i += 4) {
              fullImage.pixels[i] = frame.pixels[i];
              fullImage.pixels[i + 1] = frame.pixels[i + 1];
              fullImage.pixels[i + 2] = frame.pixels[i + 2];
              fullImage.pixels[i + 3] = frame.pixels[i + 3];
            }
          }
          break;
        case 'top-down':
          history_frames.reverse();
          for (var count = 0; count < history_frames.length; count++) {
            let frame = history_frames[count]
            let offset = count * width * size * 4;
            for (var i = offset; i < offset + size*4*width; i += 4) {
              fullImage.pixels[i] = frame.pixels[i];
              fullImage.pixels[i + 1] = frame.pixels[i + 1];
              fullImage.pixels[i + 2] = frame.pixels[i + 2];
              fullImage.pixels[i + 3] = frame.pixels[i + 3];
            }
          }
          history_frames.reverse();
          break;
      }



      fullImage.updatePixels();
      image(fullImage, 0, 0, width, height);
    }

  }

  fill('white');
  textSize(36);
  stroke('black');
  strokeWeight(4)
  text(width+'x'+height+' - '+round(frameRate())+' - '+history_frames.length+'/'+height/size, 10, 36);

}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    direction = 'bottom-up';
  } else if (keyCode === DOWN_ARROW) {
    direction = 'top-down';
  } else {
    //
  }
}
