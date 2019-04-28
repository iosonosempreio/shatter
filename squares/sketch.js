let capture,
    size = 80,
    increment = 0;

function preload(){
  // put preload code here
}

function setup() {
  // put setup code here
  createCanvas(1280/2, 720/2);

  var constraints = {
    video: {
      mandatory: {
        minWidth: 1280,
        minHeight: 720
      },
      optional: [{ maxFrameRate: 12 }]
    },
    audio: false
  };

  capture = createCapture(constraints, function(stream) {
    // console.log(stream);
  });

  capture.hide();

  angleMode(DEGREES);
  imageMode(CENTER);

  background('BLACK');
}

function draw() {
  if (capture.loadedmetadata) {

    increment += 4;
    if (increment > 360) {
      increment = 0;
    }

    for (var i=0; i<width/size; i++) {
      for (var j=0; j<height/size; j++) {
        let _x = i * size - size/2;
        let _y = j * size - size/2;
        var c = capture.get(_x, _y, size + size/2, size + size/2);

        push();
        translate(_x+size, _y+size)
        rotate(increment)
        image(c, 0, 0);
        pop();

      }
    }

  }

}

function mousePressed() {
  let fs = fullscreen();
    fullscreen(!fs);
}
