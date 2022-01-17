const theta = document.getElementById("theta");
const infographic = document.getElementById("infographic");
const graphs = document.getElementById("graphs");
const circleCanvas = document.getElementById("circle");
const sinCanvas = document.getElementById("sine");
const cosCanvas = document.getElementById("cosine");

let lastTheta = 0;

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function radiansToDegrees(radians) {
  return radians * 180 / Math.PI;
}

const axisColors = ["#ffffff", "#00ffff", "#ffff00", "#ff00ff", "#ffffff"];

function drawCircle(canvas, color) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 10;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 1, 0, 2 * Math.PI);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(canvas.width, centerY);
  ctx.strokeStyle = axisColors[0];
  ctx.lineWidth = 0.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX, 0);
  ctx.strokeStyle = axisColors[1];
  ctx.lineWidth = 0.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(0, centerY);
  ctx.strokeStyle = axisColors[2];
  ctx.lineWidth = 0.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX, canvas.height);
  ctx.strokeStyle = axisColors[3];
  ctx.lineWidth = 0.5;
  ctx.stroke();

  const x = Math.cos(lastTheta) * radius;
  const y = Math.sin(lastTheta) * radius;

  ctx.beginPath();
  ctx.moveTo(centerX + x, centerY);
  ctx.lineTo(centerX + x, centerY - y);
  ctx.strokeStyle = "#f0f";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + x, centerY);
  ctx.strokeStyle = "#0f0";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + x, centerY - y);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawGraph(canvas, color, fn, min, max) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const distance = max - min;
  const scale = canvas.width / distance;
  
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  for (let i = 0; i < 5; i++) {
    const x = [0, 0.25, 0.5, 0.75, 1][i];
    ctx.beginPath();
    ctx.moveTo(canvas.width * x, 0);
    ctx.lineTo(canvas.width * x, canvas.height);
    ctx.strokeStyle = axisColors[i];
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  ctx.beginPath();
  let started = false;
  for (let step = 0; step < canvas.width; step++) {
    const i = step / scale;
    if (i >= lastTheta) {
      break;
    }
    const x = step;
    const y = (canvas.height / 2 + fn(i) * canvas.height / 2) * 0.95 + 3;
    if (!started) {
      started = true;
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();
}

function handleResize() {
  circleCanvas.width = Math.floor(infographic.offsetWidth / 4);
  circleCanvas.height = Math.floor(infographic.offsetWidth / 4);
  sinCanvas.width = sinCanvas.parentElement.offsetWidth;
  sinCanvas.height = (circleCanvas.height - 20) / 2;
  cosCanvas.width = cosCanvas.parentElement.offsetWidth;
  cosCanvas.height = (circleCanvas.height - 20) / 2;
  render();
}

/**
 * Render the unit circle, sine and cosine graphs based on the x and y coords relative to the unit circle
 */
function render() {
  drawCircle(circleCanvas, "#0f0");
  drawGraph(
    sinCanvas,
    "#f0f",
    Math.sin, 
    0, 
    2 * Math.PI
  );
  drawGraph(
    cosCanvas,
    "#0f0",
    Math.cos, 
    0, 
    2 * Math.PI
  );
}

function updateTheta(value) {
  lastTheta = value < 0 ? value + 2 * Math.PI : value;
  theta.innerText = `θ = ${(lastTheta / Math.PI).toFixed(2)}π | ${radiansToDegrees(lastTheta).toFixed(2)}°`;
  render();
}

window.addEventListener('resize', handleResize);
circleCanvas.addEventListener("mousemove", (e) => {
  const rect = circleCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = -(e.clientY - rect.top - rect.height / 2);
  updateTheta(Math.atan2(y, x));
});
graphs.addEventListener("mousemove", (e) => {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  updateTheta((x / rect.width) * (2 * Math.PI));
});

handleResize(); 