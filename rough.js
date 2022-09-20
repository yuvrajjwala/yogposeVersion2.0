window.onload = function() {
   document.getElementById("roomaudio").play();
}


let accuracy=-1;

const URL = "https://teachablemachine.withgoogle.com/models/ySOJZcIkP/";
       let model, webcam, ctx, labelContainer, maxPredictions;
   
       async function init() {
            
            
        
           const modelURL = URL + "model.json";
           const metadataURL = URL + "metadata.json";
           document.getElementById("starting").style.display="block";
           document.getElementById("refbtn").style.display="block";
           model = await tmPose.load(modelURL, metadataURL);
           maxPredictions = model.getTotalClasses();
           const size = 400;
           const flip = true; // whether to flip the webcam
           webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
           await webcam.setup(); // request access to the webcam
           document.getElementById("starting").style.display="none";
           await webcam.play();
           
           window.requestAnimationFrame(loop);
           document.getElementById("audio").play();
   
           const canvas = document.getElementById("canvas");
           canvas.width = size; canvas.height = size;
           ctx = canvas.getContext("2d");
           labelContainer = document.getElementById("label-container");
           for (let i = 0; i < maxPredictions; i++) { // and class labels
               labelContainer.appendChild(document.createElement("div"));
           }
       }
   
       async function loop(timestamp) {
           webcam.update(); // update the webcam frame
           await predict();
           window.requestAnimationFrame(loop);
       }
   
       async function predict() {
           // Prediction #1: run input through posenet
           // estimatePose can take in an image, video or canvas html element
           const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
           // Prediction 2: run input through teachable machine classification model
           const prediction = await model.predict(posenetOutput);
   
           for (let i = 0; i < maxPredictions; i++) {
               const classPrediction =
                   prediction[i].className + ": " + prediction[i].probability.toFixed(2);
             labelContainer.childNodes[i].innerHTML = classPrediction;
             //jwala added code here
            
            if(accuracy<prediction[0].probability.toFixed(2)){
                accuracy=prediction[0].probability.toFixed(2);
            }
           }
   
           // finally draw the poses
           drawPose(pose);
       }
   
       function drawPose(pose) {
           if (webcam.canvas) {
               ctx.drawImage(webcam.canvas, 0, 0);
               // draw the keypoints and skeleton
               if (pose) {
                   const minPartConfidence = 0.5;
                   tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
                   tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
               }
           }

           //jwala added here
       }


       function stopEx(ms){
        var start = new Date().getTime();
        var end = start;
        while(end < start + ms) {
          end = new Date().getTime();
       }
     }

     function refresh(){
         stopEx(5000);
         location.reload();
     }
       

        async function showaccu(){
            document.getElementById("result").style.display="block";
            document.getElementById("result").innerHTML=accuracy;
            
           
        
       }


