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

function drawCircle(canvas, color) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 10;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 0.5;
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 1, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(canvas.width, centerY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, canvas.height);
  ctx.stroke();

  const x = Math.cos(lastTheta) * radius;
  const y = Math.sin(lastTheta) * radius;

  ctx.beginPath();
  ctx.moveTo(centerX + x, centerY);
  ctx.lineTo(centerX + x, centerY - y);
  ctx.strokeStyle = "#ff0044";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + x, centerY);
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + x, centerY - y);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawGraph(canvas, color, fn, min, max) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const distance = max - min;
  const scale = canvas.width / distance;
  
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 0.5;

  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();

  for (let i = 0; i < 8; i++) {
    const x = i / 8;
    const offset = i % 2 ? canvas.height / 6 : 0;
    ctx.beginPath();
    ctx.moveTo(canvas.width * x, offset);
    ctx.lineTo(canvas.width * x, canvas.height - offset);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(canvas.width, 0);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.stroke();

  ctx.beginPath();
  let started = false;
  for (let step = 0; step < canvas.width; step++) {
    const i = step / scale;
    if (i >= lastTheta) {
      break;
    }
    const x = step;
    const y = (canvas.height / 2 - fn(i) * canvas.height / 2) * 0.95 + 3;
    if (!started) {
      started = true;
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
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
  drawCircle(circleCanvas, "#00ff00");
  drawGraph(
    sinCanvas,
    "#ff0044",
    Math.sin, 
    0, 
    2 * Math.PI
  );
  drawGraph(
    cosCanvas,
    "#00ff00",
    Math.cos, 
    0, 
    2 * Math.PI
  );
}

function updateTheta(value) {
  lastTheta = value < 0 ? value + 2 * Math.PI : value;
  theta.innerText = `θ = ${(lastTheta / Math.PI).toFixed(2)}π | ${radiansToDegrees(lastTheta).toFixed(2)}° | x = ${Math.cos(lastTheta).toFixed(2)} | y = ${Math.sin(lastTheta).toFixed(2)}`;
  render();
}

window.addEventListener('resize', handleResize);
circleCanvas.addEventListener("mousemove", (e) => {
  const rect = circleCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = -(e.clientY - rect.top - rect.height / 2);
  updateTheta(Math.atan2(y, x));
});
function handleGraphMouse(e) {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  updateTheta((x / rect.width) * (2 * Math.PI));
}
sinCanvas.addEventListener("mousemove", handleGraphMouse);
cosCanvas.addEventListener("mousemove", handleGraphMouse);

handleResize(); 