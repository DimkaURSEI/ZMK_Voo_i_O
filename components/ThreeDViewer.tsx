
import React, { useEffect, useRef } from 'react';
import * as THREE from 'https://esm.sh/three';

interface ThreeDViewerProps {
  machineName: string;
}

const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ machineName }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Simple industrial machine representation
    const group = new THREE.Group();
    
    // Base
    const baseGeo = new THREE.BoxGeometry(2, 0.5, 3);
    const baseMat = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);

    // Main body
    const bodyGeo = new THREE.BoxGeometry(1.5, 2, 2.5);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0x555555 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.25;
    group.add(body);

    // Detail parts (cylinders)
    const cylGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 32);
    const cylMat = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
    const cyl = new THREE.Mesh(cylGeo, cylMat);
    cyl.rotation.z = Math.PI / 2;
    cyl.position.y = 2;
    group.add(cyl);

    scene.add(group);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 5;
    camera.position.y = 2;
    camera.lookAt(0, 1, 0);

    const animate = () => {
      requestAnimationFrame(animate);
      group.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [machineName]);

  return (
    <div ref={mountRef} className="w-full h-full bg-black/20 rounded-lg overflow-hidden border border-white/5" />
  );
};

export default ThreeDViewer;
