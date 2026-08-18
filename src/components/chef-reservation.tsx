"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function ChefReservation({ phone }: { phone: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const canvasW = 250;
    const canvasH = 350;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(35, canvasW / canvasH, 0.01, 100);
    camera.position.set(0, 0.5, 2.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(canvasW, canvasH);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xC9A961, 1.5);
    keyLight.position.set(3, 5, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xE0C68A, 1);
    rimLight.position.set(0, 3, -5);
    scene.add(rimLight);

    const loader = new GLTFLoader();
    let model: THREE.Group | null = null;
    let pivot: THREE.Group | null = null;

    loader.load("/chef.glb", (gltf) => {
      model = gltf.scene;

      pivot = new THREE.Group();
      pivot.add(model);
      scene.add(pivot);

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());

      const targetHeight = 0.8;
      const scale = targetHeight / size.y;
      model.scale.setScalar(scale);

      const box2 = new THREE.Box3().setFromObject(model);
      const center2 = box2.getCenter(new THREE.Vector3());
      model.position.x = -center2.x;
      model.position.z = -center2.z;
      model.position.y = -box2.min.y;

      pivot.position.y = -0.2;
      (pivot as any).baseY = pivot.position.y;
    }, undefined, (error) => {
      console.error("Error loading chef.glb:", error);
    });

    let mouseX = 0, mouseY = 0, parX = 0, parY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    mount.addEventListener("mousemove", onMouseMove);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      parX += (mouseX - parX) * 0.05;
      parY += (mouseY - parY) * 0.05;

      if (pivot) {
        pivot.rotation.y = parX * 0.5;
        pivot.position.y = (pivot as any).baseY + Math.sin(time * 1.2) * 0.05;
      }

      camera.position.x = parX * 0.2;
      camera.position.y = 0.6 - parY * 0.15;
      camera.lookAt(0, 0.5, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mount.removeEventListener("mousemove", onMouseMove);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="flex flex-col items-center mt-12 animate-pop-in">
      {/* Speech bubble */}
      <div className="bg-white rounded-2xl px-6 py-3 shadow-2xl relative z-10 mb-[-130px] animate-bubble-pop">
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />
        <p className="font-display text-base text-black font-semibold text-center whitespace-nowrap">Fa-ti o rezervare</p>
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="text-black text-lg font-bold block text-center whitespace-nowrap hover:text-gold transition-colors"
        >
          {phone}
        </a>
      </div>
      {/* Chef 3D */}
      <div ref={mountRef} className="w-[250px] h-[350px]" style={{ opacity: 0.85 }} />
    </div>
  );
}
