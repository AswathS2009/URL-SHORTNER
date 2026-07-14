import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackdrop() {
  const mountRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050608, 9, 25);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.25, 10.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const container = new THREE.Group();
    scene.add(container);

    const gridWidth = 180;
    const gridDepth = 90;
    const spacing = 0.18;
    const pointCount = gridWidth * gridDepth;
    const positions = new Float32Array(pointCount * 3);
    const basePositions = new Float32Array(pointCount * 3);

    let index = 0;
    for (let row = 0; row < gridDepth; row += 1) {
      const v = row / (gridDepth - 1);
      const z = (v - 0.5) * gridDepth * spacing;
      for (let col = 0; col < gridWidth; col += 1) {
        const u = col / (gridWidth - 1);
        const x = (u - 0.5) * gridWidth * spacing;
        const wave = Math.sin(u * Math.PI * 4.2) * 0.24 + Math.cos(v * Math.PI * 5.3) * 0.16;

        positions[index * 3] = x;
        positions[index * 3 + 1] = wave;
        positions[index * 3 + 2] = z;

        basePositions[index * 3] = x;
        basePositions[index * 3 + 1] = wave;
        basePositions[index * 3 + 2] = z;
        index += 1;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xf5f7fa,
      size: 0.03,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    container.add(points);

    const accentGeometry = new THREE.SphereGeometry(0.45, 32, 32);
    const accentMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.05,
    });
    const accent = new THREE.Mesh(accentGeometry, accentMaterial);
    accent.position.set(0, 0, -0.5);
    container.add(accent);

    const keyLight = new THREE.PointLight(0xffffff, 0.9, 30);
    keyLight.position.set(-2, 2.5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x94a3b8, 0.45, 28);
    rimLight.position.set(4, -1.5, 5);
    scene.add(rimLight);

    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    const pointer = new THREE.Vector2(0, 0);
    const pointerTarget = new THREE.Vector2(0, 0);

    const updateGlow = (clientX, clientY) => {
      const glow = glowRef.current;
      if (!glow) return;
      const rect = mount.getBoundingClientRect();
      glow.style.transform = `translate3d(${clientX - rect.left}px, ${clientY - rect.top}px, 0) translate(-50%, -50%)`;
      glow.style.opacity = "1";
    };

    const handlePointerMove = (event) => {
      const rect = mount.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      pointerTarget.set(x, y);
      updateGlow(event.clientX, event.clientY);
    };

    const handlePointerLeave = () => {
      pointerTarget.set(0, 0);
      const glow = glowRef.current;
      if (glow) {
        glow.style.opacity = "0";
      }
    };

    const handlePointerEnter = (event) => {
      updateGlow(event.clientX, event.clientY);
    };

    mount.addEventListener("pointermove", handlePointerMove);
    mount.addEventListener("pointerleave", handlePointerLeave);
    mount.addEventListener("pointerenter", handlePointerEnter);
    window.addEventListener("pointerleave", handlePointerLeave);

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();
    let requestId = 0;

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      pointer.lerp(pointerTarget, 0.06);

      const { array } = geometry.attributes.position;
      let ptrIndex = 0;
      for (let row = 0; row < gridDepth; row += 1) {
        const v = row / (gridDepth - 1);
        for (let col = 0; col < gridWidth; col += 1) {
          const u = col / (gridWidth - 1);
          const baseX = basePositions[ptrIndex * 3];
          const baseY = basePositions[ptrIndex * 3 + 1];
          const baseZ = basePositions[ptrIndex * 3 + 2];

          const waveA = Math.sin(u * Math.PI * 4.5 + elapsed * 1.1) * 0.18;
          const waveB = Math.cos(v * Math.PI * 5.7 - elapsed * 0.9) * 0.2;
          const diagonal = Math.sin((u + v) * Math.PI * 6.2 + elapsed * 0.7) * 0.12;

          const mouseX = pointer.x * 4.2;
          const mouseY = pointer.y * 1.2;
          const distX = baseX - mouseX;
          const distZ = baseZ - mouseY * 2.2;
          const falloff = Math.max(0, 1.0 - Math.sqrt(distX * distX + distZ * distZ) / 4.5);
          const ripple = Math.sin(elapsed * 4.2 - falloff * 7.5) * falloff * 0.45;

          array[ptrIndex * 3] = baseX + Math.sin(elapsed * 0.6 + v * 3.8) * 0.015;
          array[ptrIndex * 3 + 1] = baseY + waveA + waveB + diagonal + ripple * 0.35;
          array[ptrIndex * 3 + 2] = baseZ + Math.cos(elapsed * 0.35 + u * 4.1) * 0.01;

          ptrIndex += 1;
        }
      }

      geometry.attributes.position.needsUpdate = true;

      container.rotation.y = Math.sin(elapsed * 0.15) * 0.06 + pointer.x * 0.12;
      container.rotation.x = Math.sin(elapsed * 0.12) * 0.08 + pointer.y * 0.08;
      container.position.x = pointer.x * 0.45;
      container.position.y = pointer.y * 0.22;

      accent.position.x = Math.sin(elapsed * 0.7) * 2.4 + pointer.x * 1.1;
      accent.position.y = Math.cos(elapsed * 0.5) * 0.65 + pointer.y * 0.55;
      accent.scale.setScalar(1 + Math.sin(elapsed * 0.9) * 0.08);

      keyLight.position.x = -2 + pointer.x * 2.8;
      keyLight.position.y = 2.5 + pointer.y * 1.8;
      rimLight.position.x = 4 + pointer.x * -2.2;
      rimLight.position.y = -1.5 + pointer.y * 1.2;

      renderer.render(scene, camera);
      requestId = window.requestAnimationFrame(animate);
    };

    requestId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(requestId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerleave", handlePointerLeave);
      mount.removeEventListener("pointermove", handlePointerMove);
      mount.removeEventListener("pointerleave", handlePointerLeave);
      mount.removeEventListener("pointerenter", handlePointerEnter);
      geometry.dispose();
      material.dispose();
      accentGeometry.dispose();
      accentMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={mountRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        ref={glowRef}
        className="absolute left-0 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),rgba(148,163,184,0.08),transparent_72%)] opacity-0 blur-3xl transition-opacity duration-200"
      />
    </div>
  );
}
