"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import StarGrid from "./StarGrid";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import Button from "@/components/shared/Button";

export default function AnimatedContent() {
  const container = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  gsap.registerPlugin(useGSAP);

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set(
          ".hero__heading, .hero__body, .hero__button, .hero__video, .hero__glow",
          { opacity: 1 }
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

      tl.fromTo(
        ".hero__heading",
        { scale: 0.5 },
        { scale: 1, opacity: 1, duration: 1.4 }
      );

      tl.fromTo(
        ".hero__body",
        { y: 20 },
        { y: 0, opacity: 1, duration: 1.2 },
        "-=0.6"
      );

      tl.fromTo(
        ".hero__button",
        { scale: 1.5 },
        { scale: 1, opacity: 1, duration: 1.3 },
        "-=0.8"
      );

      tl.fromTo(
        ".hero__video",
        { y: 100 },
        { y: 0, opacity: 1, duration: 1.3 },
        "+=0.3"
      );

      tl.fromTo(
        ".hero__glow",
        { scale: 0.5 },
        { scale: 1, opacity: 1, duration: 1.8 },
        "-=1"
      );
    },
    { scope: container }
  );

  return (
    <div className="relative" ref={container}>
      <StarGrid />
      <h1 className="hero__heading text-balance text-5xl font-medium opacity-0 md:text-7xl text-foreground">
        Farmer
      </h1>

      <div className="hero__body mx-auto mt-6 max-w-md text-balance text-muted-foreground opacity-0">
        <p>Join Agro</p>
      </div>

      <Button
        href="/login"
        title="Join Agro Community"
        containerClass="hero__button mx-auto mt-8 opacity-0"
      />

      <div className="hero__video mx-auto mt-16 w-full opacity-0 relative px-2 sm:px-4">
        <div className="hero__glow absolute -inset-4 bg-linear-to-r from-primary/50 via-purple-500/50 to-primary/50 opacity-0 blur-3xl" />
        <div
          className="relative rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl bg-linear-to-br from-primary/10 to-transparent backdrop-blur-sm"
          style={{ aspectRatio: "16 / 11" }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent z-10 pointer-events-none" />
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/goVOUaWfykU"
            title="Agro Community Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
