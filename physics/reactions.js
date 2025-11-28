function tryFusion(a, b) {
  if (a.Z !== 1 || b.Z !== 1) return null;

  const dx = b.x - a.x, dy = b.y - a.y;
  const r = Math.sqrt(dx*dx + dy*dy);

  if (r > (a.r + b.r) * FUSION_THRESHOLD) return null;

  const dvx = b.vx - a.vx, dvy = b.vy - a.vy;
  const relKE = 0.5 * (dvx*dvx + dvy*dvy) * (a.A + b.A);

  const barrier = 4 * a.Z * b.Z; // simplified

  if (relKE < barrier) return null;

  // Fusion outcomes
  if ((a.A === 2 && b.A === 3) || (a.A === 3 && b.A === 2)) {
    return { type: "fusion", product: "He", neutrons: 1 };
  }

  return { type: "fusion", product: "He", neutrons: 0 };
}

function tryFission(nucleus, neutron) {
  if (!["U235","Pu239"].includes(nucleus.type)) return null;

  const dx = neutron.x - nucleus.x, dy = neutron.y - nucleus.y;
  const r = Math.sqrt(dx*dx + dy*dy);

  if (r > nucleus.r) return null;

  const relKE = (neutron.vx*neutron.vx + neutron.vy*neutron.vy);
  if (relKE < 40) return null;

  return {
    type: "fission",
    daughters: ["Ba141","Kr92"], 
    neutrons: 3
  };
}


