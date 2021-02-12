let mobilenet;
let videoZone = document.getElementById('video');
let video = document.getElementById('videoElement');
let text = document.getElementById('text');
let flipBtn = document.getElementById('flip');

if( window.innerWidth < window.innerHeight ) {
    videoZone.style.width = 50 + 'vw';
    videoZone.style.height = videoZone.style.width;

    video.style.height = 50 + 'vw';
    video.style.width = video.style.height;
} else {
    videoZone.style.width = 50 + 'vh'
    videoZone.style.height = videoZone.style.width;

    video.style.height = 50 + 'vh';
    video.style.width = video.style.height;
}

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
      })
      .catch(function (err0r) {
        console.log("Something went wrong!");
      });
  }

  function modelReady() {
    console.log('Model is ready!!');
    mobilenet.predict(gotResults);
}

function gotResults(error, results) {
    if(error) {
        console.log(error);
    } else {
       // console.log(results);

        let ans = results[0].label;
        for(let i = 0; i < ans.length; i++) {
          if( ans[i] == ',' ) {
           ans = ans.slice(0, i);
            break;
          }
        }
        //console.log(ans);

        text.innerHTML = ans;

        mobilenet.predict(gotResults);
    }

}

mobilenet = ml5.imageClassifier('MobileNet', video, modelReady);

// default user media options
let defaultsOpts = { audio: false, video: true }
let shouldFaceUser = true;

// check whether we can use facingMode
let supports = navigator.mediaDevices.getSupportedConstraints();
if( supports['facingMode'] === true ) {
  flipBtn.disabled = false;
}

let stream = null;

function capture() {
  defaultsOpts.video = { facingMode: shouldFaceUser ? 'user' : 'environment' }
  navigator.mediaDevices.getUserMedia(defaultsOpts)
    .then(function(_stream) {
      stream  = _stream;
      video.srcObject = stream;
      video.play();
    })
    .catch(function(err) {
      console.log(err)
    });
}

flipBtn.addEventListener('click', function(){
  if( stream == null ) return
  // we need to flip, stop everything
  stream.getTracks().forEach(t => {
    t.stop();
  });
  // toggle / flip
  shouldFaceUser = !shouldFaceUser;
  
  if( video.classList.contains('mirror') ) {
      video.classList.remove('mirror');
      video.classList.add('mirroroff');
  } else if( video.classList.contains('mirroroff') ){
    video.classList.remove('mirroroff');
    video.classList.add('mirror');
  }
  
  //console.log('ok');
  capture();
})

capture();
