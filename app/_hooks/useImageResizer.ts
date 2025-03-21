"use client";

import { useState, useCallback, JSX } from "react";
import ResizedImage from "../_contentBlocks/ResizedImage";

type ResizeOptions = {
  format?: string;
  quality?: number;
  smoothing?: boolean;
};

type ImageResizerHook = {
  resizedImage: string | null;
  isLoading: boolean;
  error: Error | null;
  resizeImage: (
    file: File,
    targetWidth: number,
    targetHeight: number,
    options?: ResizeOptions
  ) => Promise<void>;
  ImagePreview: () => JSX.Element | null;
};

export const useImageResizer = (): ImageResizerHook => {
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  const resizeImage = useCallback(
    async (
      file: File,
      targetWidth: number,
      targetHeight: number,
      options: ResizeOptions = {}
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const img = new window.Image();
        const reader = new FileReader();

        // Load image file
        const loadImage = new Promise<void>((resolve, reject) => {
          reader.onload = (e) => {
            if (e.target?.result) {
              img.src = e.target.result as string;
              resolve();
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Wait for image to load
        await loadImage;
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
        });

        // Create canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new Error("Could not create canvas context");
        }

        // Set canvas dimensions
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Configure image rendering quality
        ctx.imageSmoothingQuality = options.quality ? "high" : "low";
        ctx.imageSmoothingEnabled = options.smoothing ?? true;

        // Draw and resize image
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Convert to data URL
        const resizedDataUrl = canvas.toDataURL(
          options.format || "image/webp",
          options.quality
        );

        setResizedImage(resizedDataUrl);
        setDimensions({ width: targetWidth, height: targetHeight });
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError(err as Error);
        throw err;
      }
    },
    []
  );

  const ImagePreview = () => {
    if (!resizedImage) return null;

    return ResizedImage({ resizedImage, dimensions });
  };

  return {
    resizedImage,
    isLoading,
    error,
    resizeImage,
    ImagePreview,
  };
};
