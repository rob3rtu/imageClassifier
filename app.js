let mobilenet;
let dropArea = document.getElementById('picture');
let text = document.getElementById('text');
let puffin = document.getElementById('puffin');

if( window.innerWidth < window.innerHeight ) {
    dropArea.style.width = 50 + 'vw';
    dropArea.style.height = dropArea.style.width;
} else {
    dropArea.style.width = 50 + 'vh'
    dropArea.style.height = dropArea.style.width;
}

dropArea.addEventListener('dragover', e => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});

dropArea.addEventListener('drop', e => {
    e.stopPropagation();
    e.preventDefault();
    
    let files = e.dataTransfer.files;
    for (let i = 0, file; file = files[i]; i++) {
        if (file.type.match(/image.*/)) {
            let reader = new FileReader();

            reader.onload = e2 => {
                // finished reading file data.
                let img = document.createElement('img');
                puffin.src= e2.target.result;
            }
            reader.readAsDataURL(file); // start reading the file data.
        }
    }

    function modelReady() {
        console.log('Model is ready!!');
        mobilenet.predict(puffin, gotResults);
    }
    
    function gotResults(error, results) {
        if(error) {
            console.log(error);
        } else {
            //console.log(results);
    
            let ans = results[0].label;
            for(let i = 0; i < ans.length; i++) {
                 if( ans[i] == ',' ) {
                 ans = ans.slice(0, i);
                     break;
          }
        }
            //console.log(ans);
    
            text.innerHTML = ans;
        }
    
    }
    
    mobilenet = ml5.imageClassifier('MobileNet', modelReady);
});
