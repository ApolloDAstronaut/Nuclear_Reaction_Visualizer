initRenderer();

const worker = new Worker("workers/simulationWorker.js");
let latestFrame = null;

worker.onmessage = e => latestFrame = e.data;

initUI(worker);

(function loop() {
  requestAnimationFrame(loop);
  if (latestFrame) draw(latestFrame);
})();

