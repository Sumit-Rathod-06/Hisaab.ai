import React, { useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, LinearFilter } from 'three';
import { OrbitControls, RoundedBox } from '@react-three/drei';

// Simple component that renders a laptop-like geometry and maps a texture or color
function ScreenPlane({ texture, color }) {
    return (
        <mesh position={[0, 0.35, -0.055]} rotation={[-0.02, 0, 0]}>
            <planeGeometry args={[1.8, 1.05]} />
            {texture ? (
                <meshBasicMaterial map={texture} toneMapped={false} />
            ) : (
                <meshBasicMaterial color={color || '#10b981'} />
            )}
        </mesh>
    );
}

function LaptopBody() {
    return (
        <group>
            {/* Base */}
            <mesh position={[0, -0.45, 0.12]} rotation={[0, 0, 0]}>
                <boxGeometry args={[2.4, 0.06, 1.4]} />
                <meshStandardMaterial color="#2b2b2b" metalness={0.4} roughness={0.6} />
            </mesh>

            {/* Screen bezel - thin frame */}
            <mesh position={[0, 0.12, -0.45]}>
                <boxGeometry args={[1.95, 1.15, 0.06]} />
                <meshStandardMaterial color="#111" metalness={0.2} roughness={0.4} />
            </mesh>

            {/* Screen inner (for depth) */}
            <mesh position={[0, 0.12, -0.48]}>
                <boxGeometry args={[1.86, 1.06, 0.02]} />
                <meshStandardMaterial color="#fff" />
            </mesh>
        </group>
    );
}

function Scene({ images = [], activeIndex = 0, colors = [] }) {
    const [texture, setTexture] = useState(null);
    const [error, setError] = useState(false);

    const currentImage = images[activeIndex] || images[0];
    const currentColor = colors[activeIndex] || colors[0] || '#10b981';

    useEffect(() => {
        if (!currentImage) {
            setTexture(null);
            return;
        }

        // Try to load texture with error handling
        const loader = new TextureLoader();
        loader.load(
            currentImage,
            (loadedTexture) => {
                loadedTexture.minFilter = LinearFilter;
                loadedTexture.magFilter = LinearFilter;
                setTexture(loadedTexture);
                setError(false);
            },
            undefined,
            (err) => {
                console.warn('Failed to load texture:', currentImage, err);
                setTexture(null);
                setError(true);
            }
        );
    }, [currentImage]);

    return (
        <>
            <ambientLight intensity={0.9} />
            <directionalLight position={[5, 10, 5]} intensity={0.6} />
            <group position={[0, -0.15, 0]}>
                <LaptopBody />
                <ScreenPlane texture={texture} color={currentColor} />
            </group>
        </>
    );
}

export default function Laptop3D({ images = [], activeIndex = 0, colors = [], width = '100%', height = 480 }) {
    return (
        <div style={{ width, height, touchAction: 'none' }}>
            <Canvas camera={{ position: [0, 0.6, 3.5], fov: 35 }}>
                <Scene images={images} activeIndex={activeIndex} colors={colors} />
                <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 8} maxPolarAngle={Math.PI / 2.6} />
            </Canvas>
        </div>
    );
}
