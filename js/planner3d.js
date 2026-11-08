/**
 * AgriVision - Module 1: Real-Life 3D WebGL Perspective Farm Viewer (Three.js)
 * Features photorealistic multi-layer procedural trees with fruit clusters,
 * raised vegetable crop rows, transparent arched polyhouse with interior beds,
 * water pond with depth, and perimeter post fencing with directional sun shadows.
 */

let threeScene, threeCamera, threeRenderer, threeControls;
let animationFrameId = null;

function initThreeJS() {
  const container = document.getElementById('three-container');
  if (!container || typeof THREE === 'undefined') return;

  container.innerHTML = '';
  const width = container.clientWidth || 550;
  const height = container.clientHeight || 500;

  // 1. Scene
  threeScene = new THREE.Scene();
  update3DTheme(STATE.theme);

  // 2. Camera with cinematic 45 degree FOV
  threeCamera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
  threeCamera.position.set(0, 95, 125);

  // 3. WebGL Renderer with High-Precision Shadows & Antialiasing
  threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  threeRenderer.setSize(width, height);
  threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  threeRenderer.shadowMap.enabled = true;
  threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(threeRenderer.domElement);

  // 4. Smooth Spherical OrbitControls
  if (typeof THREE.OrbitControls !== 'undefined') {
    threeControls = new THREE.OrbitControls(threeCamera, threeRenderer.domElement);
    threeControls.enableDamping = true;
    threeControls.dampingFactor = 0.05;
    threeControls.maxPolarAngle = Math.PI / 2.05;
    threeControls.minDistance = 20;
    threeControls.maxDistance = 320;
  }

  // 5. Realistic Dual Lighting: Sky Hemisphere + Directional Sunlight
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x3d4d3d, 0.75);
  hemiLight.position.set(0, 120, 0);
  threeScene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xfffae8, 1.1);
  sunLight.position.set(70, 130, 55);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 10;
  sunLight.shadow.camera.far = 350;
  sunLight.shadow.camera.left = -110;
  sunLight.shadow.camera.right = 110;
  sunLight.shadow.camera.top = 110;
  sunLight.shadow.camera.bottom = -110;
  sunLight.shadow.bias = -0.0008;
  threeScene.add(sunLight);

  // Ambient fill light for realistic soft shadows
  const ambientLight = new THREE.AmbientLight(0xdbe6dd, 0.35);
  threeScene.add(ambientLight);

  animateThree();
  render3D();
}

function update3DTheme(theme) {
  if (!threeScene) return;
  const isDark = theme === 'dark';
  const bgColor = isDark ? 0x09140e : 0xdce8da;
  threeScene.background = new THREE.Color(bgColor);
  threeScene.fog = new THREE.FogExp2(bgColor, 0.0035);
}

// Procedural Real-Life 3D Mesh Instantiation
function render3D() {
  if (!threeScene) return;
  const p = getActiveParcel();

  // Remove dynamic children (keep the 3 lights at index 0, 1, 2)
  while (threeScene.children.length > 3) {
    threeScene.remove(threeScene.children[threeScene.children.length - 1]);
  }

  // 1. Natural Loam Farmland Soil Ground Plane
  const groundGeo = new THREE.PlaneGeometry(p.L, p.W, 16, 16);
  const groundMat = new THREE.MeshLambertMaterial({ 
    color: STATE.theme === 'dark' ? 0x1a261d : 0xbfae93
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  threeScene.add(ground);

  // 2. 3m Perimeter Vehicular Gravel Road
  const roadW = p.L;
  const roadH = p.W;
  const roadMat = new THREE.MeshLambertMaterial({ color: 0x7a6956 });
  
  // Outer road ribbon border
  const roadGeo = new THREE.BoxGeometry(roadW, 0.08, roadH);
  const roadInnerCut = new THREE.BoxGeometry(roadW - 6, 0.1, roadH - 6);
  // Line segments indicating road edges
  const roadEdges = new THREE.EdgesGeometry(roadGeo);
  const roadLine = new THREE.LineSegments(roadEdges, new THREE.LineBasicMaterial({ color: 0x4e3e30, linewidth: 2 }));
  roadLine.position.y = 0.06;
  threeScene.add(roadLine);

  // 3. Perimeter Wooden Fence Posts & Wire Lines
  const postGeo = new THREE.CylinderGeometry(0.18, 0.22, 1.4, 6);
  const postMat = new THREE.MeshLambertMaterial({ color: 0x5d4037 });
  const postSpacing = 10; // Every 10 meters

  // Add fence posts along 4 edges
  for (let x = -p.L / 2; x <= p.L / 2; x += postSpacing) {
    [-p.W / 2, p.W / 2].forEach(z => {
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(x, 0.7, z);
      post.castShadow = true;
      threeScene.add(post);
    });
  }
  for (let z = -p.W / 2; z <= p.W / 2; z += postSpacing) {
    [-p.L / 2, p.L / 2].forEach(x => {
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(x, 0.7, z);
      post.castShadow = true;
      threeScene.add(post);
    });
  }

  // Fence guide wire
  const fenceWire = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(p.L, 1.2, p.W)),
    new THREE.LineBasicMaterial({ color: 0x81c784, linewidth: 1.5 })
  );
  fenceWire.position.y = 0.8;
  threeScene.add(fenceWire);

  // 4. Instantiation of Farm Zones
  p.objs.forEach(o => {
    const posX = o.x + o.w / 2 - p.L / 2;
    const posZ = o.y + o.h / 2 - p.W / 2;

    if (o.type === 'crop') {
      // Raised Vegetable Beds with Realistic Planting Rows & Foliage
      const bedHeight = 0.7;
      const bedGeo = new THREE.BoxGeometry(o.w, bedHeight, o.h);
      const bedMat = new THREE.MeshLambertMaterial({ color: 0x4e3825 });
      const bed = new THREE.Mesh(bedGeo, bedMat);
      bed.position.set(posX, bedHeight / 2, posZ);
      bed.castShadow = true;
      bed.receiveShadow = true;
      threeScene.add(bed);

      // Micro-furrows & Lush Green Vegetable Crops Running Along Rows
      const rowCount = Math.max(3, Math.floor(o.h / 2.2));
      for (let ri = 0; ri < rowCount; ri++) {
        const rowZ = posZ - o.h / 2 + (ri + 0.5) * (o.h / rowCount);
        
        // Dark Soil Furrow Mound
        const furrowGeo = new THREE.BoxGeometry(o.w * 0.94, 0.22, 0.65);
        const furrowMat = new THREE.MeshLambertMaterial({ color: 0x3d2b1d });
        const furrow = new THREE.Mesh(furrowGeo, furrowMat);
        furrow.position.set(posX, bedHeight + 0.1, rowZ);
        threeScene.add(furrow);

        // Green Leafy Crop Clusters on Top of Furrows
        const plantCount = Math.max(4, Math.floor(o.w / 2.5));
        for (let pi = 0; pi < plantCount; pi++) {
          const plantX = posX - o.w / 2 + (pi + 0.5) * (o.w / plantCount);
          const bushGeo = new THREE.DodecahedronGeometry(0.48);
          const bushMat = new THREE.MeshLambertMaterial({ color: 0x2e7d32 });
          const bush = new THREE.Mesh(bushGeo, bushMat);
          bush.position.set(plantX, bedHeight + 0.45, rowZ);
          bush.castShadow = true;
          threeScene.add(bush);
        }
      }
    } 
    else if (o.type === 'orchard') {
      // Orchard Ground Cover
      const orchardBedGeo = new THREE.BoxGeometry(o.w, 0.12, o.h);
      const orchardBedMat = new THREE.MeshLambertMaterial({ color: 0x3d5a3d });
      const orchardBed = new THREE.Mesh(orchardBedGeo, orchardBedMat);
      orchardBed.position.set(posX, 0.06, posZ);
      orchardBed.receiveShadow = true;
      threeScene.add(orchardBed);

      // Real-Life Multi-Cluster Botanical Trees with Fruits
      const sp = o.spacing || 6;
      const isMango = (o.crop === 'mango') || (sp >= 6);
      const fruitCol = isMango ? 0xf39c12 : 0xc5e1a5; // Golden Mango or Lime Guava

      for (let tx = o.x + sp / 2; tx < o.x + o.w; tx += sp) {
        for (let ty = o.y + sp / 2; ty < o.y + o.h; ty += sp) {
          const treeX = tx - p.L / 2;
          const treeZ = ty - p.W / 2;

          // Tree Trunk with Natural Bark Hue
          const trunkHeight = isMango ? 3.2 : 2.4;
          const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.32, 0.52, trunkHeight, 8),
            new THREE.MeshLambertMaterial({ color: 0x4a3525 })
          );
          trunk.position.set(treeX, trunkHeight / 2, treeZ);
          trunk.castShadow = true;
          trunk.receiveShadow = true;
          threeScene.add(trunk);

          // Central Main Foliage Crown
          const crownRadius = isMango ? 2.5 : 1.7;
          const crownY = trunkHeight + crownRadius * 0.85;

          const mainCrown = new THREE.Mesh(
            new THREE.DodecahedronGeometry(crownRadius, 1),
            new THREE.MeshLambertMaterial({ color: 0x1b5e20 })
          );
          mainCrown.position.set(treeX, crownY, treeZ);
          mainCrown.castShadow = true;
          mainCrown.receiveShadow = true;
          threeScene.add(mainCrown);

          // Surrounding Organic Foliage Clumps for Realism
          const clumpOffsets = [
            [-0.7 * crownRadius, -0.2, 0.6 * crownRadius],
            [0.6 * crownRadius, 0.2, -0.6 * crownRadius],
            [0.5 * crownRadius, -0.1, 0.5 * crownRadius]
          ];

          clumpOffsets.forEach(co => {
            const clump = new THREE.Mesh(
              new THREE.DodecahedronGeometry(crownRadius * 0.55),
              new THREE.MeshLambertMaterial({ color: 0x2e7d32 })
            );
            clump.position.set(treeX + co[0], crownY + co[1], treeZ + co[2]);
            clump.castShadow = true;
            threeScene.add(clump);
          });

          // Fruit Accents on Orchard Canopy
          const fruitGeo = new THREE.SphereGeometry(0.25, 6, 6);
          const fruitMat = new THREE.MeshLambertMaterial({ color: fruitCol });

          [
            [treeX + crownRadius * 0.7, crownY - 0.4, treeZ + crownRadius * 0.3],
            [treeX - crownRadius * 0.6, crownY + 0.3, treeZ - crownRadius * 0.5],
            [treeX + 0.2, crownY - 0.5, treeZ - crownRadius * 0.7]
          ].forEach(pos => {
            const fruit = new THREE.Mesh(fruitGeo, fruitMat);
            fruit.position.set(pos[0], pos[1], pos[2]);
            threeScene.add(fruit);
          });
        }
      }
    } 
    else if (o.type === 'pond') {
      // Real-Life Water Pond with Depth & Stone Embankment
      // 1. Earthen Embankment Berm Rim
      const bermGeo = new THREE.BoxGeometry(o.w + 1.2, 0.5, o.h + 1.2);
      const bermMat = new THREE.MeshLambertMaterial({ color: 0x5d4037 });
      const berm = new THREE.Mesh(bermGeo, bermMat);
      berm.position.set(posX, 0.25, posZ);
      berm.receiveShadow = true;
      threeScene.add(berm);

      // 2. Realistic Water Surface with Depth & Specular Glow
      const waterGeo = new THREE.BoxGeometry(o.w, 0.35, o.h);
      const waterMat = new THREE.MeshPhongMaterial({
        color: 0x0288d1,
        specular: 0xb3e5fc,
        shininess: 90,
        transparent: true,
        opacity: 0.88
      });
      const water = new THREE.Mesh(waterGeo, waterMat);
      water.position.set(posX, 0.22, posZ);
      threeScene.add(water);
    } 
    else if (o.type === 'greenhouse') {
      // Real-Life Solar Polyhouse with Metal Trusses and Interior Beds
      // 1. Concrete Foundation Plinth
      const plinthGeo = new THREE.BoxGeometry(o.w, 0.3, o.h);
      const plinthMat = new THREE.MeshLambertMaterial({ color: 0x78909c });
      const plinth = new THREE.Mesh(plinthGeo, plinthMat);
      plinth.position.set(posX, 0.15, posZ);
      threeScene.add(plinth);

      // 2. Arched / Pitched Translucent Polyhouse Structure
      const ghHeight = 4.2;
      const ghGeo = new THREE.BoxGeometry(o.w, ghHeight, o.h);
      const ghMat = new THREE.MeshPhongMaterial({
        color: 0x80deea,
        specular: 0xffffff,
        shininess: 80,
        transparent: true,
        opacity: 0.52
      });
      const gh = new THREE.Mesh(ghGeo, ghMat);
      gh.position.set(posX, ghHeight / 2 + 0.3, posZ);
      gh.castShadow = true;
      threeScene.add(gh);

      // 3. Structural Galvanized Steel Truss Ribs
      const trussFrame = new THREE.LineSegments(
        new THREE.EdgesGeometry(ghGeo),
        new THREE.LineBasicMaterial({ color: 0x006064, linewidth: 2 })
      );
      trussFrame.position.set(posX, ghHeight / 2 + 0.3, posZ);
      threeScene.add(trussFrame);

      // 4. Interior Cultivation Beds Visible Through Glass
      const innerBedGeo = new THREE.BoxGeometry(o.w * 0.82, 0.4, o.h * 0.7);
      const innerBedMat = new THREE.MeshLambertMaterial({ color: 0x2e7d32 });
      const innerBed = new THREE.Mesh(innerBedGeo, innerBedMat);
      innerBed.position.set(posX, 0.4, posZ);
      threeScene.add(innerBed);
    }
  });

  if (threeControls) {
    threeControls.target.set(0, 0, 0);
  }
}

function animateThree() {
  animationFrameId = requestAnimationFrame(animateThree);
  if (threeControls) threeControls.update();
  if (threeRenderer && threeScene && threeCamera) {
    threeRenderer.render(threeScene, threeCamera);
  }
}

function resize3D() {
  const container = document.getElementById('three-container');
  if (!container || !threeCamera || !threeRenderer) return;
  const width = container.clientWidth || container.parentElement?.clientWidth || 380;
  const height = container.clientHeight || 320;
  if (width === 0 || height === 0) return;
  threeCamera.aspect = width / height;
  threeCamera.updateProjectionMatrix();
  threeRenderer.setSize(width, height);
}

window.addEventListener('resize', resize3D);
window.initThreeJS = initThreeJS;
window.render3D = render3D;
window.resize3D = resize3D;
window.update3DTheme = update3DTheme;
