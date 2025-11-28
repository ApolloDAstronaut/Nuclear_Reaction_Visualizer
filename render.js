let ctx, canvas;

function initRenderer() {
  canvas = document.getElementById('sim');
  ctx = canvas.getContext('2d');
  resize();
  window.addEventListener('resize', resize);
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function draw(frame) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw heat grid
  const cellW = canvas.width / GRID_SIZE;
  const cellH = canvas.height / GRID_SIZE;

  ctx.globalAlpha = 0.45;
  for (let y=0; y<GRID_SIZE; y++) {
    for (let x=0; x<GRID_SIZE; x++) {
      const t = frame.grid[y][x];
      if (t > 0.1) {
        ctx.fillStyle = `rgb(${t*3},0,${255 - t*1.2})`;
        ctx.fillRect(x*cellW, y*cellH, cellW, cellH);
      }
    }
  }
  ctx.globalAlpha = 1;

  // draw nuclei
  for (let n of frame.nuclei) {
    ctx.fillStyle = n.color;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
    ctx.fill();
  }

  // shockwaves
  for (let s of frame.reactions) {
    ctx.strokeStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI*2);
    ctx.stroke();
  }
}

