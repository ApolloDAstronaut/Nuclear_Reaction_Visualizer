importScripts("../physics/constants.js");
importScripts("../physics/isotopes.js");
importScripts("../physics/reactions.js");

let mode = "fusion";
let paused = false;
let nuclei = [];
let reactions = [];
let grid = [];

function initGrid() {
  grid = Array.from({length:GRID_SIZE}, ()=>Array(GRID_SIZE).fill(0));
}

function spawn(type, x, y) {
  const I = ISOTOPES[type];
  nuclei.push({
    type,
    x, y,
    vx:(Math.random()-0.5)*40,
    vy:(Math.random()-0.5)*40,
    Z:I.Z,
    A:I.A,
    r:I.r,
    color:I.color
  });
}

function initFusion() {
  nuclei = [];
  for (let i=0;i<60;i++) spawn("H",Math.random()*800,Math.random()*600);
}

function initFission() {
  nuclei = [];
  for (let i=0;i<40;i++) spawn("U235",Math.random()*800,Math.random()*600);
  for (let i=0;i<40;i++) spawn("U238",Math.random()*800,Math.random()*600);
}

initGrid();
initFusion();

function step() {
  if (paused) return;

  let newReactions = [];

  // Coulomb forces
  for (let i=0;i<nuclei.length;i++) {
    for (let j=i+1;j<nuclei.length;j++) {
      let a=nuclei[i], b=nuclei[j];
      let dx=b.x-a.x, dy=b.y-a.y;
      let r2=dx*dx+dy*dy + 8;
      let r=Math.sqrt(r2);

      let f = K_COULOMB*(a.Z*b.Z)/r2;
      let fx = f*(dx/r), fy=f*(dy/r);

      a.vx -= fx*DT;
      a.vy -= fy*DT;
      b.vx += fx*DT;
      b.vy += fy*DT;

      // Fusion
      const fus = tryFusion(a,b);
      if (fus) {
        newReactions.push({x:(a.x+b.x)/2,y:(a.y+b.y)/2,radius:1,alpha:1});
        const nx = a.x, ny=a.y;

        nuclei.splice(j,1);
        nuclei.splice(i,1);

        spawn(fus.product, nx, ny);
        for (let k=0;k<fus.neutrons;k++) spawn("n",nx,ny);
        continue;
      }
    }
  }

  // motion update
  for (let n of nuclei) {
    n.x += n.vx*DT;
    n.y += n.vy*DT;
  }

  // heat diffusion
  diffuseHeat();

  // shockwave expansion
  for (let s of reactions) {
    s.radius += 100*DT;
    s.alpha -= 0.5*DT;
  }
  reactions = reactions.concat(newReactions).filter(s=>s.alpha>0.05);
}

function diffuseHeat() {
  const g2 = Array.from({length:GRID_SIZE}, ()=>Array(GRID_SIZE).fill(0));
  for (let y=1;y<GRID_SIZE-1;y++) {
    for (let x=1;x<GRID_SIZE-1;x++) {
      g2[y][x] =
        -grid[y][x] +
         0.2*(grid[y][x+1]+grid[y][x-1]+grid[y+1][x]+grid[y-1][x]) +
         0.05*(grid[y-1][x-1]+grid[y-1][x+1]+grid[y+1][x-1]+grid[y+1][x+1]);
    }
  }
  grid = g2;
}

function loop() {
  step();
  postMessage({ nuclei, reactions, grid });
  setTimeout(loop,16);
}
loop();

onmessage = e => {
  const {cmd,value,type} = e.data;
  if (cmd==="pause") paused=!paused;
  if (cmd==="reset") {
    initGrid();
    if (mode==="fusion") initFusion();
    else initFission();
  }
  if (cmd==="mode") {
    mode=value;
    initGrid();
    value==="fusion"?initFusion():initFission();
  }
  if (cmd==="add") spawn(type,400,300);
  if (cmd==="setTemp") {
    for (let y=0;y<GRID_SIZE;y++)
      for (let x=0;x<GRID_SIZE;x++) grid[y][x]=value;
  }
  if (cmd==="setU235") {
    // regenerate a mix for simplicity
    initFission();
  }
};

