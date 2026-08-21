"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

export default function BuildingHero3D({ onDoorsOpen }: { onDoorsOpen?: () => void }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ============================================
    // Scene setup
    // ============================================
    const scene = new THREE.Scene();
    scene.background = null;

    const isMobile = window.innerWidth < 768;
    const fov = isMobile ? 70 : 50;
    const camera = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 4, 15);
    camera.lookAt(0, 1.8, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = isMobile ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false; // manual control — only update when car moves
    renderer.shadowMap.needsUpdate = true; // initial render
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    // A richer environment map so the glossy black body paint picks up
    // realistic reflections (studio-style triple-light setup). We build
    // a custom scene with 3 rect-area lights to simulate a car showroom,
    // which gives much better reflections on black paint than the flat
    // RoomEnvironment.
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    // Key light (warm, top-left)
    const envKey = new THREE.RectAreaLight(0xfff5e6, 80, 20, 20);
    envKey.position.set(10, 15, -10);
    envKey.lookAt(0, 0, 0);
    envScene.add(envKey);
    // Fill light (cool, right side)
    const envFill = new THREE.RectAreaLight(0xe6f0ff, 40, 15, 15);
    envFill.position.set(-12, 8, 8);
    envFill.lookAt(0, 0, 0);
    envScene.add(envFill);
    // Rim/back light (bright strip behind car — creates the signature
    // reflection streak along the side of a black car)
    const envRim = new THREE.RectAreaLight(0xffffff, 120, 30, 6);
    envRim.position.set(0, 10, -20);
    envRim.lookAt(0, 0, 0);
    envScene.add(envRim);
    // Floor bounce
    const envFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6 })
    );
    envFloor.rotation.x = -Math.PI / 2;
    envFloor.position.y = -5;
    envScene.add(envFloor);
    scene.environment = pmremGenerator.fromScene(envScene, 0.02).texture;
    scene.environmentIntensity = 1.0;
    pmremGenerator.dispose();
    // Dispose env scene objects — they're no longer needed after PMREM
    envScene.traverse((obj: any) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });

    // ============================================
    // Lighting
    // ============================================
    const keyLight = new THREE.DirectionalLight(0xfff4e0, 14.0);
    keyLight.position.set(15, 25, 15);
    keyLight.castShadow = true;
    const shadowMapSize = isMobile ? 512 : 1024;
    keyLight.shadow.mapSize.width = shadowMapSize;
    keyLight.shadow.mapSize.height = shadowMapSize;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 100;
    keyLight.shadow.camera.left = -30;
    keyLight.shadow.camera.right = 30;
    keyLight.shadow.camera.top = 30;
    keyLight.shadow.camera.bottom = -30;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x88aaff, 2.5);
    fillLight.position.set(-15, 15, -10);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffaa66, 1.0);
    rimLight.position.set(0, 10, -20);
    scene.add(rimLight);

    const ambient = new THREE.AmbientLight(0x8899aa, 7.5);
    scene.add(ambient);

    const fillLight2 = new THREE.DirectionalLight(0xaaccff, 4.2);
    fillLight2.position.set(0, 5, 15); // from the front/camera side, fills dark undercarriage/shadow areas
    scene.add(fillLight2);

    // ============================================
    // Ground shadow — invisible plane that only catches shadows,
    // so the van looks grounded (not floating) without a visible floor.
    // ============================================
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // ============================================
    // Helpers
    // ============================================
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    // ============================================
    // State
    // ============================================
    let carModel: THREE.Group | null = null;
    let rearDoorL: THREE.Object3D | null = null;
    let rearDoorR: THREE.Object3D | null = null;
    let trunkDoor: THREE.Object3D | null = null;
    // Wheel meshes that should spin while the car slides in.
    let wheelMeshes: THREE.Object3D[] = [];
    let arrivalDuration = 3; // seconds
    let slideStartX = 20; // recomputed once the model loads, based on camera framing
    let parkedX = 0; // the X position where the car should park (center)
    const clock = new THREE.Clock();
    let modelLoaded = false;
    // How far each rear door swings open (radians), around its vertical hinge.
    const REAR_DOOR_OPEN_ANGLE = Math.PI / 2.4;

    // Two phases:
    //  1) "arriving" — car slides in from the right (time-based, NOT tied
    //     to scroll). Page scroll is fully locked during this phase.
    //  2) "doors" — scroll-jacked, scroll progress (0→1) opens the rear doors.
    type Phase = "arriving" | "doors";
    let phase: Phase = "arriving";
    let arrivalElapsed = 0;
    let scrollProgress = 0;
    let smoothScrollProgress = 0;

    // ============================================
    // Load mercedes model with animation
    // ============================================
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);
    loader.setMeshoptDecoder(MeshoptDecoder);
    console.log("%cLoading mercedes.glb...", "color: #d4a050;");
    loader.load(
      "/mercedes.glb",
      (gltf) => {
        console.log("%cmercedes.glb loaded!", "color: #00ff00; font-weight: bold;");

        // The GLB has 2 scenes: Scene 0 has the car (11 nodes), Scene 1 is empty.
        // gltf.scene defaults to json.scene (which is 1 = empty). Use Scene 0 instead.
        if (gltf.scenes.length > 1 && gltf.scene.children.length === 0) {
          console.log("[hero-3d] Default scene empty, switching to Scene 0");
          gltf.scene = gltf.scenes[0];
        }
        carModel = gltf.scene;

        // Rotate the car 90° so its length runs along the X axis
        // (front pointing left, toward -X). In the GLB the car faces the
        // camera (along Z), so sliding it along X looks like crab-walking.
        // A -90° Y rotation makes it face left and drive right-to-left.
        carModel.rotation.y = -Math.PI / 2;

        // Scale model to reasonable size
        const box = new THREE.Box3().setFromObject(carModel);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        // Bigger on desktop, same on mobile
        const targetSize = isMobile ? 12 : 16;
        const scale = targetSize / maxDim;
        carModel.scale.setScalar(scale);

        // Center on ground (after rotation + scale, bbox is correct)
        const box2 = new THREE.Box3().setFromObject(carModel);
        const center = box2.getCenter(new THREE.Vector3());
        carModel.position.x -= center.x;
        carModel.position.z -= center.z;
        carModel.position.y -= box2.min.y;

        // Each rear door's origin was baked (in Blender) at its vertical
        // hinge point (front edge of the door, near the B-pillar), so
        // rotating it in place around Y opens it like a real car door.
        // The car faces right on screen, hinges are on the right side of
        // each door (front), handle on the left (rear) — pulling it
        // swings the rear edge outward.
        rearDoorL = carModel.getObjectByName("RearDoor_L") ?? null;
        rearDoorR = carModel.getObjectByName("RearDoor_R") ?? null;
        if (!rearDoorL || !rearDoorR) console.warn("[hero-3d] RearDoor_L/RearDoor_R not found in mercedes.glb!");

        // The door handles are part of the TrunkDoor mesh (Desirefx_me_fixed_delat.003),
        // which is parented to the car body — not to the rear doors. When the doors
        // swing open, the handles stay floating in the air. Since we can't separate
        // them without Blender, we hide the TrunkDoor mesh when doors open.
        // (The trunk itself is not visible during the door animation anyway.)
        const trunkDoorObj = carModel.getObjectByName("TrunkDoor") ?? null;
        if (trunkDoorObj) {
          trunkDoor = trunkDoorObj;
          console.log("[hero-3d] Found TrunkDoor (handles) — will hide on door open");
        } else {
          console.warn("[hero-3d] TrunkDoor not found — handles will float!");
        }

        // Collect all wheel parts (tires, rims, brake discs) so we can
        // spin them while the car slides in. The wheels rotate around
        // their local X axis (the axle), which is correct regardless of
        // the carModel's -90° Y rotation because rotation is applied in
        // local space before the parent transform.
        // Collect tires and rims only (not brake discs/calipers — those
        // stay static). Three.js sanitizes names: dots/spaces stripped.
        // Tires → axle on X, rims → axle on Y.
        const wheelNamePattern = /^(inwhell\d*|Desirefx_me_rims\d*(_1)?|Plane(006|008|009|248|250)(_1)?)$/;
        wheelMeshes = [];
        const wheelAxes: Map<THREE.Object3D, "x" | "y" | "z"> = new Map();
        carModel.traverse((child: any) => {
          if (!child.isMesh) return;
          if (!wheelNamePattern.test(child.name)) return;
          const geo = child.geometry;
          if (!geo.boundingBox) geo.computeBoundingBox();
          const bb = geo.boundingBox;
          const dx = bb.max.x - bb.min.x;
          const dy = bb.max.y - bb.min.y;
          const dz = bb.max.z - bb.min.z;
          const dims = [dx, dy, dz];
          const minIdx = dims.indexOf(Math.min(...dims));
          const axis = (["x", "y", "z"] as const)[minIdx];
          wheelMeshes.push(child);
          wheelAxes.set(child, axis);
        });
        (wheelMeshes as any)._axes = wheelAxes;
        console.log(`[hero-3d] Found ${wheelMeshes.length} wheel meshes:`, wheelMeshes.map((w: any) => `${w.name}(${wheelAxes.get(w)})`));

        // Make the rear doors' interior faces pure matte black. The doors
        // use body.009 (glossy black paint, doubleSided=true) — when the
        // door swings open, the back faces reflect the environment map and
        // appear grey. We can't just flip to FrontSide (that would show
        // through to whatever is behind). Instead we clone each door mesh's
        // geometry, render it with BackSide + a pure-black, no-light material,
        // and parent it to the door so it follows the door's rotation.
        // Using MeshBasicMaterial (not Standard) so it ignores ALL lights
        // and environment maps — stays pure black no matter what.
        const interiorBackingMat = new THREE.MeshBasicMaterial({
          color: 0x000000,
          side: THREE.BackSide,
        });
        for (const door of [rearDoorL, rearDoorR]) {
          if (!door) continue;
          const meshes: THREE.Mesh[] = [];
          door.traverse((child: any) => {
            if (child.isMesh && !child.name.endsWith("_interior")) meshes.push(child);
          });
          for (const child of meshes) {
            // Flip the door's own material to FrontSide only — this stops
            // the glossy paint from rendering on the interior face.
            if (Array.isArray(child.material)) {
              child.material.forEach((m: any) => { m.side = THREE.FrontSide; });
            } else if (child.material) {
              child.material.side = THREE.FrontSide;
            }
            // Add a BackSide mesh with pure matte black to cover the interior.
            const backing = new THREE.Mesh(child.geometry, interiorBackingMat);
            backing.name = child.name + "_interior";
            backing.castShadow = false;
            backing.receiveShadow = false;
            child.add(backing);
          }
        }

        // Shadows — skip the thin logo decal plane (it's basically flat
        // against the body and was casting a visible dark halo/shadow onto it)
        carModel.traverse((child: any) => {
          if (child.isMesh) {
            if (child.name === "LogoPlane" || child.parent?.name === "LogoPlane") {
              child.castShadow = false;
              child.receiveShadow = false;
              return;
            }
            const bbox = new THREE.Box3().setFromObject(child);
            const sz = bbox.getSize(new THREE.Vector3());
            const maxChild = Math.max(sz.x, sz.y, sz.z);
            child.castShadow = maxChild > 0.5;
            child.receiveShadow = true;

            // Interior parts: replace their material with MeshBasicMaterial
            // (pure black, ignores ALL lights and env maps) so nothing
            // shows through when the doors open.
            if (/^interior/.test(child.name)) {
              child.castShadow = false;
              child.receiveShadow = false;
              child.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
            }

            // Tires: pure matte black — MeshBasicMaterial ignores all lights
            // and environment maps, so tires stay deep black (not grey from
            // reflections or ambient light).
            if (/^Plane(006|008|009|248|250)(_1)?$/.test(child.name)) {
              child.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
            }
          }
        });

        scene.add(carModel);

        // Parked position = current centered X. Start position = far left.
        parkedX = carModel.position.x; // current centered position = park target
        // Fixed offset: 15 units to the left = well off-screen at z=15, fov=50
        slideStartX = parkedX - 15;
        carModel.position.x = slideStartX; // start off-screen to the left

        clock.getDelta(); // discard accumulated load time so arrival starts at dt≈0
        modelLoaded = true;
        console.log(`%cCar loaded! parkX=${parkedX.toFixed(2)} slideStartX=${slideStartX.toFixed(2)} duration=${arrivalDuration}s`, "color: #d4a050; font-weight: bold;");
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          const pct = Math.round((xhr.loaded / xhr.total) * 100);
          if (pct % 25 === 0) {
            console.log(`%cLoading mercedes.glb: ${pct}%`, "color: #d4a050;");
          }
        }
      },
      (error) => {
        console.error("Error loading mercedes.glb:", error);
      }
    );

    // ============================================
    // Scroll tracking — only relevant during the "doors" phase.
    // During "arriving", scroll is fully locked (page can't move at all).
    // ============================================
    let scrollUnlocked = false;
    let doorsOpened = false;
    const heroHeight = () => window.innerHeight * 1.1;
    const animRange = () => heroHeight() - window.innerHeight;

    const onScroll = () => {
      if (phase === "arriving") {
        // Hard lock: snap back to top, van hasn't finished arriving yet.
        if (window.scrollY !== 0) window.scrollTo(0, 0);
        scrollProgress = 0;
        return;
      }
      const scrollY = window.scrollY;
      scrollProgress = clamp(scrollY / animRange(), 0, 1);
      // Unlock scroll immediately when user reaches the bottom of the
      // hero animation range — no need to wait for smoothScrollProgress
      // to catch up (that caused a "bouncing" effect at the boundary).
      if (!scrollUnlocked && scrollProgress >= 1.0) {
        scrollUnlocked = true;
        console.log("%cDoors open — scroll unlocked!", "color: #44ff44;");
      }
    };

    const clampScroll = () => {
      if (phase === "arriving") {
        if (window.scrollY !== 0) window.scrollTo(0, 0);
        return;
      }
      if (!scrollUnlocked && window.scrollY > animRange()) {
        window.scrollTo(0, animRange());
        scrollProgress = 1.0;
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (phase === "arriving") {
        // Block all scroll input while the van is arriving
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      // Once unlocked, completely stop interfering with scroll
      if (scrollUnlocked) return;
      // While doors are opening, allow scroll up freely but block past animRange
      if (window.scrollY >= animRange() - 2 && e.deltaY > 0) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    let lastTouchY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (phase === "arriving") {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (scrollUnlocked) return;
      if (window.scrollY >= animRange() - 2) {
        const touch = e.touches[0];
        if (touch && lastTouchY !== null) {
          const deltaY = touch.clientY - lastTouchY;
          if (deltaY < 0) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
        lastTouchY = touch?.clientY ?? null;
      } else {
        lastTouchY = e.touches[0]?.clientY ?? null;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    onScroll();

    // ============================================
    // Update — phase 1 drives itself via elapsed time,
    // phase 2 is driven by scroll progress
    // ============================================
    let arrivalProgress = 0; // 0→1, used for camera during phase 1

    function updateAnimation() {
      // Clamp dt so a background-tab freeze, a RAF stall, or a StrictMode
      // remount hiccup can't make the car jump multiple seconds forward
      // in a single frame (the "light speed" teleport symptom).
      const dt = Math.min(clock.getDelta(), 1 / 30);

      if (phase === "arriving") {
        arrivalElapsed += dt;
        arrivalProgress = clamp(arrivalElapsed / arrivalDuration, 0, 1);
        // Ease-out — fast start, gentle stop, like a car braking to park.
        const eased = easeOutCubic(arrivalProgress);

        // Move carModel directly — one object, one axis.
        if (carModel) {
          carModel.position.x = lerp(slideStartX, parkedX, eased);
        }
        // Shadow needs update only while the car is moving
        renderer.shadowMap.needsUpdate = true;

        // Spin the wheels. Each wheel part has its axle on a different
        // local axis (tires → X, rims → Y), so we rotate around the
        // detected axis. Speed is proportional to the car's velocity:
        // derivative of easeOutCubic(t) = 3(1-t)^2.
        const travelDistance = Math.abs(slideStartX - parkedX);
        const velocityFactor = 3 * Math.pow(1 - arrivalProgress, 2);
        const wheelRotationSpeed = (travelDistance / arrivalDuration) * velocityFactor;
        const wheelDelta = wheelRotationSpeed * dt;
        const axes = (wheelMeshes as any)._axes as Map<THREE.Object3D, "x" | "y" | "z">;
        for (const wheel of wheelMeshes) {
          const axis = axes?.get(wheel) ?? "x";
          wheel.rotation[axis] += wheelDelta;
        }

        if (arrivalProgress >= 1) {
          phase = "doors";
          // Show hero text immediately when car stops — no scroll needed
          doorsOpened = true;
          onDoorsOpen?.();
          console.log("%cCar parked — scroll to open doors", "color: #44ff44;");
        }
        return;
      }

      // phase === "doors"
      const lerpSpeed = 6;
      const t = 1 - Math.exp(-lerpSpeed * dt);
      smoothScrollProgress = lerp(smoothScrollProgress, scrollProgress, t);

      // Trigger text appearance as soon as the doors start opening (5% scroll)
      if (!doorsOpened && smoothScrollProgress >= 0.05) {
        doorsOpened = true;
        onDoorsOpen?.();
      }

      // Hinges are at the FRONT edge of each rear door (near the B-pillar).
      // The handle is at the REAR edge. Pulling it outward swings the rear
      // edge away from the body — left door swings one way, right door the
      // other, both opening outward like real car doors.
      if (rearDoorL) rearDoorL.rotation.y = -smoothScrollProgress * REAR_DOOR_OPEN_ANGLE;
      if (rearDoorR) rearDoorR.rotation.y = smoothScrollProgress * REAR_DOOR_OPEN_ANGLE;

      // Hide the TrunkDoor mesh (contains door handles) as doors open —
      // handles are parented to the trunk, not the doors, so they'd float.
      // Fade out between 0% and 15% scroll, fully hidden after that.
      if (trunkDoor) {
        const handleOpacity = Math.max(0, 1 - smoothScrollProgress / 0.15);
        trunkDoor.traverse((child: any) => {
          if (!child.isMesh) return;
          if (Array.isArray(child.material)) {
            child.material.forEach((m: any) => {
              m.transparent = true;
              m.opacity = handleOpacity;
            });
          } else if (child.material) {
            child.material.transparent = true;
            child.material.opacity = handleOpacity;
          }
        });
        trunkDoor.visible = handleOpacity > 0.01;
      }
    }

    // ============================================
    // Camera — stays completely fixed. The van simply slides in from the
    // right and stops; no orbit/turn (that gave the illusion of the van
    // turning to face the camera, which we don't want).
    // ============================================
    function updateCamera() {
      camera.position.set(0, 3, 15);
      camera.lookAt(0, 1, 0);
    }

    // ============================================
    // Animation loop
    // ============================================
    let disposed = false; // stops a stray RAF loop from a React StrictMode
    // double-mount/cleanup cycle in dev — without this, an old loop can
    // keep running in the background and steal frames from the real one,
    // causing occasional huge `dt` spikes (animation appears to "teleport").
    const animate = () => {
      if (disposed) return;
      requestAnimationFrame(animate);
      // Skip rendering when the hero section is scrolled out of view —
      // saves GPU/CPU and prevents jank in the sections below.
      const heroBottom = window.innerHeight;
      if (window.scrollY > heroBottom) {
        clampScroll();
        return;
      }
      clampScroll();
      if (modelLoaded) {
        updateAnimation();
        updateCamera();
      }
      renderer.render(scene, camera);
    };
    animate();

    // ============================================
    // Resize
    // ============================================
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const mobile = window.innerWidth < 768;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.0 : 1.5));
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
      }, 150);
    };
    window.addEventListener("resize", onResize);

    // ============================================
    // Cleanup
    // ============================================
    return () => {
      disposed = true;
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      dracoLoader.dispose();
      groundGeo.dispose();
      groundMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
