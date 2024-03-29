let capture,
    increment = -1,
    fr = 24,
    size = 10,
    history_frames = [],
    fullImage;

let www = 1280, hhh = 720;

function preload(){
  // put preload code here
}

function setup() {
  // put setup code here
  createCanvas(www, hhh);
  // pixelDensity(1);

  background('BLACK');

  frameRate(fr);

  var constraints = {
    video: {
      mandatory: {
        minWidth: www,
        minHeight: hhh
      },
      optional: [{ maxFrameRate: fr }]
    },
    audio: false
  };

  capture = createCapture(constraints, function(stream) {
    console.log(stream);
  });

  // capture.hide();

  fullImage = createImage(width, height);

  fullImage.loadPixels();
  for (let i = 0; i < fullImage.width; i++) {
    for (let j = 0; j < fullImage.height; j++) {
      fullImage.set(i, j, color(0, 90, 102, 0.01 * (i % fullImage.width) * (j % fullImage.height)));
    }
  }
  fullImage.updatePixels();

}

function draw() {

  background('black')

  if (capture.loadedmetadata) {

    increment ++;
    if (increment >= (height/size)) { increment = 0; }

    // history of frames
    history_frames.push(capture.get(0, 0, width, height));

    if (history_frames.length > height/size) {
      let removed_frame = history_frames.shift();
    }
    // else {
    //   console.log('loading... ', history_frames.length, '/', height/size);
    // }

    history_frames[history_frames.length-1].loadPixels();

    // console.log(history_frames.length);


    // handle full image
    fullImage.loadPixels();

    // history_frames = history_frames.reverse();

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

    // history_frames.forEach(function(frame, count) {
    //   // console.log(count);
    //   // console.log('frame', frame.pixels.length)
    //   // console.log('full image', fullImage.pixels.length);
    //
    //
    // });

    fullImage.updatePixels();

    fill('white');

    if (history_frames.length == height/size) {
      image(fullImage, 0, 0, width, height);
      text(frameRate(), 20, 40);
    } else {
      fill('white');
      text(history_frames.length+'/'+height/size, 20, 20);
    }

  }


}

function getStripe(n) {
  return capture.get(0, n, width, size);
}
