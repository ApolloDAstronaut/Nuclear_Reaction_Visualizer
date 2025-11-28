function initUI(worker) {
  document.getElementById("pause").onclick = () => {
    worker.postMessage({cmd:"pause"});
  };
  document.getElementById("reset").onclick = () => {
    worker.postMessage({cmd:"reset"});
  };

  document.getElementById("temp").oninput = e => {
    worker.postMessage({cmd:"setTemp", value:+e.target.value});
  };

  document.getElementById("addH").onclick = () => worker.postMessage({cmd:"add","type":"H"});
  document.getElementById("addD").onclick = () => worker.postMessage({cmd:"add","type":"D"});
  document.getElementById("addT").onclick = () => worker.postMessage({cmd:"add","type":"T"});

  document.getElementById("u235").oninput = e => worker.postMessage({cmd:"setU235", value:+e.target.value});
  document.getElementById("u238").oninput = e => worker.postMessage({cmd:"setU238", value:+e.target.value});

  for (let btn of document.querySelectorAll(".mode-btn")) {
    btn.onclick = () => worker.postMessage({cmd:"mode", value:btn.dataset.mode});
  }
}

