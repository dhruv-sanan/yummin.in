"use client";

import { useState } from "react";
import Spline from "@splinetool/react-spline";

export function SplineHero() {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="relative h-[400px] w-full md:h-[500px] lg:h-[600px]">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary/20">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            )}

            {/* 
        Replace this scene URL with a real Burger or Drink 3D model from Spline.
        Current URL is a placeholder/demo scene provided by Spline docs or similar.
        If it fails, it shows the loading state or empty.
      */}
            <Spline
                scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
                onLoad={() => setIsLoading(false)}
                className="h-full w-full"
            />
        </div>
    );
}
