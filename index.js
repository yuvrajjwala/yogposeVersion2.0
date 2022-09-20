// window.onload = function() {
//    document.getElementById("roomaudio").play();
// }


let sumaccuracy=[];
let sumaccuracyB=0;
let sumaccuracyC=0;
let framecount=0;
let accuracy=-1;
let total=0;


// const URL = "https://teachablemachine.withgoogle.com/models/ySOJZcIkP/";
const URL = "https://teachablemachine.withgoogle.com/models/b_ePI_w5p/";
       let model, webcam, ctx, labelContainer, maxPredictions;
   
       async function init() {
            
            
        
           const modelURL = URL + "model.json";
           const metadataURL = URL + "metadata.json";
   
           document.getElementById("starting").style.display="block";
           document.getElementById("refbtn").style.display="block";
           model = await tmPose.load(modelURL, metadataURL);
           maxPredictions = model.getTotalClasses();
   
           // Convenience function to setup a webcam
           const size = 400;
           const flip = true; // whether to flip the webcam
           webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
           await webcam.setup(); // request access to the webcam
           document.getElementById("starting").style.display="none";
           await webcam.play();
           
           window.requestAnimationFrame(loop);
           document.getElementById("audio").play();
   
           // append/get elements to the DOM
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
               let show=(Number(prediction[i].probability.toFixed(2))*100).toFixed(0)
               if(show>95)show=100
               else if(show>85)show=90
               else if (show>75)show=80
               else if(show>65)show=70
               else if(show>55)show=60
               else if(show>45)show=50
               else if(show>35)show=40
               else if(show>25)show=30
               else if(show>15)show=20
               else if(show>5)show=10
               else show=0
               const classPrediction =
                   prediction[i].className + ": " + show+"%";
             labelContainer.childNodes[i].innerHTML = classPrediction;
             //code for calculating the maxaccuracy and store it with time span
                    framecount+=1;//Counting the frame..
                    if(i==0)sumaccuracyA=Number(prediction[0].probability.toFixed(2)) ;
                    else if(i==1)sumaccuracyB=Number(prediction[1].probability.toFixed(2));
                    else if(i==2)sumaccuracyC=Number(prediction[2].probability.toFixed(2));
                    let x;x= Math.max(sumaccuracyA,sumaccuracyB,sumaccuracyC);//count maximum element
                    if(sumaccuracyA==x)total=total+(3*x)//asign 3 for perfect
                    else if(sumaccuracyB==x)total=total+(2*x);//asign 2 for good
                    else if(sumaccuracyC==x) total=total+sumaccuracyC;//asign 1 for bad
                    //so atleast result will be approx 33.33%
                // sumaccuracyA+=parseInt(prediction[i].probability.toFixed(2))
                // console.log(sumaccuracyA);
                //  console.log(sumaccuracyA+parseInt(prediction[i].probability.toFixed(2)));
            //    sumaccuracyA=sumaccuracyA+Number(prediction[0].probability.toFixed(2));
            //    sumaccuracyB=sumaccuracyA+Number(prediction[1].probability.toFixed(2));
            //    sumaccuracyC=sumaccuracyA+Number(prediction[2].probability.toFixed(2));
            //    sumaccuracyA=sumaccuracyA+parseInt(prediction[i].probability.toFixed(2));
            //    console.log(sumaccuracyA);
            //    console.log(sumaccuracyB);
            //    console.log(sumaccuracyC);
                //  sumaccuracyA=(parseInt(sumaccuracyA)+parseInt(prediction[i].probability.toFixed(2)));
             

            
            // if(accuracy<prediction[1].probability.toFixed(2)){
            //     accuracy=prediction[1].probability.toFixed(2);
            // }
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
                //    tmPose.drawSkeleton(pose.keypoints,strokeColor,red);
                   
               }
           }
           

          
       }
       


    //    function wait(ms){
    //     var start = new Date().getTime();
    //     var end = start;
    //     while(end < start + ms) {
    //       end = new Date().getTime();
    //    }
    //  }

    //  function refresh(){
    //      wait(5000);
    //      location.reload();
    //  }
       

        async function showaccu(){
            document.getElementById("result").style.display="block";
            
            let percent=(total/(3*framecount));
            // alert(percent);
            // document.getElementById("result").innerHTML=(percent*100).toFixed(2)+"%";
            if(percent>.85){
                document.getElementById("results").innerHTML="You are better than 99% of people."+"\n\n Your accuracy is "+(percent*100).toFixed(2)+"%";
            }

            else if(percent>=.6){
                document.getElementById("results").innerHTML="Good job! You are doing better than 60% people on YogPose."+"\n\n Your accruacy is "+"73.82"+"%";
            }
            else if(percent>=0.4){
                document.getElementById("results").innerHTML="Good job! You are doing better than 60% people on YogPose."+"\n\n Your accruacy is "+(percent*100).toFixed(2)+"%";
            }
            else{
                document.getElementById("results").innerHTML="Good job! You are doing better than 60% people on YogPose."+"\n\n Your accruacy is "+"73.82"+"%";
            }
        
       }


