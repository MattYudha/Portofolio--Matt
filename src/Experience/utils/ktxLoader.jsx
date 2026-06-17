import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";
import * as THREE from "three";
import { useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { usePortfolioStore } from "../../store/usePortfolioStore";

// Global registry for materials that need day/night tinting
export const globalMaterialsRegistry = new Set();


export const useKTX2Texture = (
  textureUrl,
  transparent = true,
  alphaTestValue = 0.6,
  side = "front",
  materialType = "basic",
  useEmissiveMap = true
) => {
  const { gl } = useThree();

  const texture = useLoader(KTX2Loader, textureUrl, (loader) => {
    loader.setTranscoderPath("/basis/");
    loader.detectSupport(gl);
  });

  useEffect(() => {
    if (texture) {
      gl.initTexture(texture);
    }
  }, [gl, texture]);

  const material = useMemo(() => {
    if (!texture) return null;

    const MaterialClass = materialType === "standard" ? THREE.MeshStandardMaterial : THREE.MeshBasicMaterial;

    const mat = new MaterialClass({
      map: texture,
      emissiveMap: materialType === "standard" && useEmissiveMap ? texture : null,
      transparent,
      alphaTest: alphaTestValue,
      side: side === "front" ? THREE.FrontSide : THREE.DoubleSide,
      roughness: materialType === "standard" ? 1.0 : undefined, // Fully matte for paper look
    });
    
    globalMaterialsRegistry.add(mat);
    return mat;
  }, [texture, transparent, alphaTestValue, materialType, side, useEmissiveMap]);

  useEffect(() => {
    return () => {
      if (material) {
        globalMaterialsRegistry.delete(material);
      }
    };
  }, [material]);

  return material;
};

useKTX2Texture.preload = (url) =>
  useLoader.preload(KTX2Loader, url, (loader) => {
    loader.setTranscoderPath("/basis/");
  });
