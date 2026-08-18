"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

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
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    // No RoomEnvironment — it was washing out textures with white reflections.
    // Use only direct lights (set up below) for a controlled, predictable look.

    // ============================================
    // Lighting
    // ============================================
    const keyLight = new THREE.DirectionalLight(0xfff4e0, 14.0);
    keyLight.position.set(15, 25, 15);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
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

    // ============================================
    // State
    // ============================================
    let truckModel: THREE.Group | null = null;
    let slideRootObj: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let wheelActions: THREE.AnimationAction[] = [];
    let doorActions: THREE.AnimationAction[] = [];
    let arrivalDuration = 3; // seconds
    let doorDuration = 1;
    let slideStartX = 20; // recomputed once the model loads, based on camera framing
    let parkedX = 0; // the X position where the van should park (center)
    const clock = new THREE.Clock();
    let modelLoaded = false;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    // Two phases:
    //  1) "arriving" — van slides in + wheels spin automatically (time-based,
    //     NOT tied to scroll). Page scroll is fully locked during this phase.
    //  2) "doors" — scroll-jacked, scroll progress (0→1) opens both doors.
    type Phase = "arriving" | "doors";
    let phase: Phase = "arriving";
    let arrivalElapsed = 0;
    let wheelSpinTime = 0; // accumulates wheel rotation time during arrival
    let scrollProgress = 0;
    let smoothScrollProgress = 0;

    // ============================================
    // Load truck model with animation
    // ============================================
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    loader.setDRACOLoader(dracoLoader);
    console.log("%cLoading truck.glb...", "color: #d4a050;");
    loader.load(
      "/truck.glb",
      (gltf) => {
        console.log("%ctruck.glb loaded!", "color: #00ff00; font-weight: bold;");
        truckModel = gltf.scene;

        // IMPORTANT: Reset SlideRoot to origin BEFORE anything else.
        // The GLB has SlideRoot at x=17.5 (its baked start position).
        // If we center the model while SlideRoot is at 17.5, then later
        // reset SlideRoot to 0, the van shifts 17.5 units left and ends
        // up off-center. Reset first, then center on the correct bbox.
        slideRootObj = truckModel.getObjectByName("SlideRoot") ?? null;
        if (slideRootObj) slideRootObj.position.x = 0;

        // Rotate the van 90° so its length runs along the X axis
        // (front pointing left, toward -X). In the GLB the van faces the
        // camera (along Z), so sliding it along X looks like crab-walking.
        // A -90° Y rotation makes it face left and drive right-to-left.
        truckModel.rotation.y = -Math.PI / 2;

        // Scale model to reasonable size
        const box = new THREE.Box3().setFromObject(truckModel);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        // Bigger on desktop, same on mobile
        const targetSize = isMobile ? 8 : 12;
        const scale = targetSize / maxDim;
        truckModel.scale.setScalar(scale);

        // Center on ground (after rotation + scale, bbox is correct)
        const box2 = new THREE.Box3().setFromObject(truckModel);
        const center = box2.getCenter(new THREE.Vector3());
        truckModel.position.x -= center.x;
        truckModel.position.z -= center.z;
        truckModel.position.y -= box2.min.y;

        // Shadows — skip the thin logo decal plane (it's basically flat
        // against the body and was casting a visible dark halo/shadow onto it)
        truckModel.traverse((child: any) => {
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
          }
        });

        scene.add(truckModel);

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(truckModel);
          console.log(`%cAnimations: ${gltf.animations.length}`, "color: #00ffff;");

          const wheelClips: THREE.AnimationClip[] = [];
          const doorClips: THREE.AnimationClip[] = [];
          gltf.animations.forEach((clip, i) => {
            console.log(`  [${i}] ${clip.name} | duration: ${clip.duration}s | tracks: ${clip.tracks.length}`);
            if (clip.name.startsWith("Door_")) {
              doorClips.push(clip);
            } else if (clip.name.startsWith("Wheel_")) {
              wheelClips.push(clip);
            }
            // SlideRootAction is intentionally skipped — position is manual.
          });

          doorDuration = doorClips.length > 0 ? Math.max(...doorClips.map((c) => c.duration)) : 1;

          const setupAction = (clip: THREE.AnimationClip) => {
            const action = mixer!.clipAction(clip);
            action.setLoop(THREE.LoopOnce, 1);
            action.clampWhenFinished = true;
            action.play();
            action.paused = true;
            return action;
          };
          wheelActions = wheelClips.map(setupAction);
          doorActions = doorClips.map(setupAction);
        } else {
          console.warn("No animations found in truck.glb!");
        }

        // Parked position = current centered X. Start position = far right.
        parkedX = truckModel.position.x; // current centered position = park target
        // Fixed offset: 15 units to the right = well off-screen at z=15, fov=50
        slideStartX = parkedX + 15;
        truckModel.position.x = slideStartX; // start off-screen to the right

        clock.getDelta(); // discard accumulated load time so arrival starts at dt≈0
        modelLoaded = true;
        console.log(`%cTruck loaded! parkX=${parkedX.toFixed(2)} slideStartX=${slideStartX.toFixed(2)} duration=${arrivalDuration}s`, "color: #d4a050; font-weight: bold;");
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          const pct = Math.round((xhr.loaded / xhr.total) * 100);
          if (pct % 25 === 0) {
            console.log(`%cLoading truck.glb: ${pct}%`, "color: #d4a050;");
          }
        }
      },
      (error) => {
        console.error("Error loading truck.glb:", error);
      }
    );

    // ============================================
    // Scroll tracking — only relevant during the "doors" phase.
    // During "arriving", scroll is fully locked (page can't move at all).
    // ============================================
    let scrollUnlocked = false;
    let doorsOpened = false;
    const heroHeight = () => window.innerHeight * 3;
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
      if (scrollUnlocked) return;
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
      // remount hiccup can't make the van jump multiple seconds forward
      // in a single frame (the "light speed" teleport symptom).
      const dt = Math.min(clock.getDelta(), 1 / 30);

      if (phase === "arriving") {
        arrivalElapsed += dt;
        arrivalProgress = clamp(arrivalElapsed / arrivalDuration, 0, 1);
        // LINEAR — no easing at all. Pure constant speed slide.
        const eased = arrivalProgress;

        // Move truckModel directly — one object, one axis, no mixer.
        if (truckModel) {
          truckModel.position.x = lerp(slideStartX, parkedX, eased);
        }

        // Wheels: spin continuously throughout arrival, slowing down
        // gradually to a complete stop exactly when the van parks.
        // Use quadratic falloff so wheels stay fast longer, then slow
        // down sharply near the end (like real braking).
        const wheelSpeed = 6.0 * Math.pow(1 - eased, 2);
        wheelSpinTime += dt * wheelSpeed;
        if (wheelActions.length > 0) {
          const wheelClipDuration = wheelActions[0].getClip().duration;
          const targetTime = wheelSpinTime % wheelClipDuration;
          wheelActions.forEach((action) => {
            action.time = targetTime;
          });
          if (mixer) mixer.update(0);
        }

        if (arrivalProgress >= 1) {
          phase = "doors";
          console.log("%cVan parked — scroll to open doors", "color: #44ff44;");
        }
        return;
      }

      // phase === "doors"
      const lerpSpeed = 6;
      const t = 1 - Math.exp(-lerpSpeed * dt);
      smoothScrollProgress = lerp(smoothScrollProgress, scrollProgress, t);

      // Trigger text appearance as soon as doors start opening (5% scroll)
      if (!doorsOpened && smoothScrollProgress >= 0.05) {
        doorsOpened = true;
        onDoorsOpen?.();
      }

      if (!scrollUnlocked && smoothScrollProgress >= 0.99) {
        scrollUnlocked = true;
        renderer.shadowMap.autoUpdate = false;
        renderer.shadowMap.needsUpdate = true;
        console.log("%cDoors open — scroll unlocked!", "color: #44ff44;");
      }

      if (mixer && doorActions.length > 0) {
        const targetTime = smoothScrollProgress * doorDuration;
        doorActions.forEach((action) => {
          action.time = targetTime;
        });
        mixer.update(0);
      }
    }

    // ============================================
    // Camera — stays completely fixed. The van simply slides in from the
    // right and stops; no orbit/turn (that gave the illusion of the van
    // turning to face the camera, which we don't want).
    // ============================================
    function updateCamera() {
      camera.position.set(0, 4, 15);
      camera.lookAt(0, 1.5, 0);
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
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
    };
    window.addEventListener("resize", onResize);

    // ============================================
    // Cleanup
    // ============================================
    return () => {
      disposed = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      // pmremGenerator no longer used (RoomEnvironment removed)
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
