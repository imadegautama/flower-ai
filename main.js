import modelURL from "/models/flower-model/model.json?url";
import metadataURL from "/models/flower-model/metadata.json?url";

const initButton = document.querySelector("#init-button");
const jjpText = document.querySelector("#jjp-text");
const jjpPercentage = document.querySelector("#jjp-percentage");
const bText = document.querySelector("#b-text");
const bPercentage = document.querySelector("#b-percentage");
const pText = document.querySelector("#p-text");
const pPercentage = document.querySelector("#p-percentage");
const jText = document.querySelector("#j-text");
const jPercentage = document.querySelector("#j-percentage");
const sText = document.querySelector("#s-text");
const sPercentage = document.querySelector("#s-percentage");
const loadingContainer = document.querySelector("#loading-container");

initButton.addEventListener("click", () => {
  init();
});

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
  if (webcam) {
    return;
  }

  // const modelURL = URL + "model.json";
  // const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
  loadingContainer.style.display = "block";
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  loadingContainer.style.display = "none";
  window.requestAnimationFrame(loop);

  // append elements to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);

  for (let i = 0; i < maxPredictions; i++) {
    for (let i = 0; i < maxPredictions; i++) {
      const percentage = (prediction[i].probability * 100).toFixed(0);

      if (prediction[i].className === "Base") {
        bText.innerHTML = `${percentage}%`;
        bPercentage.style.width = `${percentage}%`;
      }
      if (prediction[i].className === "Jepun Jepang") {
        jjpText.innerHTML = `${percentage}%`;
        jjpPercentage.style.width = `${percentage}%`;
      }
      if (prediction[i].className === "Sandat") {
        sText.innerHTML = `${percentage}%`;
        sPercentage.style.width = `${percentage}%`;
      }
      if (prediction[i].className === "Jepun") {
        jText.innerHTML = `${percentage}%`;
        jPercentage.style.width = `${percentage}%`;
      }

      if (prediction[i].className === "Pucuk") {
        pText.innerHTML = `${percentage}%`;
        pPercentage.style.width = `${percentage}%`;
      }
    }

    // const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2) * 100;
    // labelContainer.childNodes[i].innerHTML = classPrediction;
  }
}

[
  {
    className: "Base",
    probability: 0.011904952116310596,
  },
  {
    className: "Jepun",
    probability: 0.02864021249115467,
  },
  {
    className: "Jepun Jepang",
    probability: 0.3060056269168854,
  },
  {
    className: "Pucuk",
    probability: 0.5879726409912109,
  },
  {
    className: "Sandat",
    probability: 0.06547655165195465,
  },
];
