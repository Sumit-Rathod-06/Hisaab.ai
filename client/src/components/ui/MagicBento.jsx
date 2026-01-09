import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import "./MagicBento.css";

const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = "132, 0, 255";
const MOBILE_BREAKPOINT = 768;

const calculateSpotlightValues = (radius) => ({
    proximity: radius * 0.5,
    fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
    const rect = card.getBoundingClientRect();
    const relativeX = ((mouseX - rect.left) / rect.width) * 100;
    const relativeY = ((mouseY - rect.top) / rect.height) * 100;

    card.style.setProperty("--glow-x", `${relativeX}%`);
    card.style.setProperty("--glow-y", `${relativeY}%`);
    card.style.setProperty("--glow-intensity", glow.toString());
    card.style.setProperty("--glow-radius", `${radius}px`);
};

const useMobileDetection = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return isMobile;
};

export default function MagicBento({
    cards,
    textAutoHide = true,
    enableSpotlight = true,
    enableBorderGlow = true,
    disableAnimations = false,
    spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
    enableTilt = true,
    glowColor = DEFAULT_GLOW_COLOR,
    clickEffect = false,
    enableMagnetism = false,
    className = "",
}) {
    const gridRef = useRef(null);
    const cardRefs = useRef([]);
    const spotlightRef = useRef(null);

    const isMobile = useMobileDetection();
    const shouldDisableAnimations = disableAnimations || isMobile;

    const baseCardClassName = useMemo(() => {
        return [
            "magic-bento-card",
            textAutoHide ? "magic-bento-card--text-autohide" : "",
            enableBorderGlow ? "magic-bento-card--border-glow" : "",
        ]
            .filter(Boolean)
            .join(" ");
    }, [textAutoHide, enableBorderGlow]);

    useEffect(() => {
        if (shouldDisableAnimations || !enableSpotlight || !gridRef.current) return;

        const spotlight = document.createElement("div");
        spotlight.className = "global-spotlight";
        spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;

        document.body.appendChild(spotlight);
        spotlightRef.current = spotlight;

        const handleMouseMove = (e) => {
            if (!spotlightRef.current || !gridRef.current) return;

            const section = gridRef.current.closest(".bento-section");
            const rect = section?.getBoundingClientRect();
            const mouseInside =
                rect &&
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom;

            const cardsEls = cardRefs.current.filter(Boolean);

            if (!mouseInside) {
                gsap.to(spotlightRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out",
                });

                cardsEls.forEach((card) => card.style.setProperty("--glow-intensity", "0"));
                return;
            }

            const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
            let minDistance = Infinity;

            cardsEls.forEach((card) => {
                const cardRect = card.getBoundingClientRect();
                const centerX = cardRect.left + cardRect.width / 2;
                const centerY = cardRect.top + cardRect.height / 2;
                const distance =
                    Math.hypot(e.clientX - centerX, e.clientY - centerY) -
                    Math.max(cardRect.width, cardRect.height) / 2;
                const effectiveDistance = Math.max(0, distance);

                minDistance = Math.min(minDistance, effectiveDistance);

                let glowIntensity = 0;
                if (effectiveDistance <= proximity) {
                    glowIntensity = 1;
                } else if (effectiveDistance <= fadeDistance) {
                    glowIntensity =
                        (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
                }

                updateCardGlowProperties(card, e.clientX, e.clientY, glowIntensity, spotlightRadius);
            });

            gsap.to(spotlightRef.current, {
                left: e.clientX,
                top: e.clientY,
                duration: 0.1,
                ease: "power2.out",
            });

            const targetOpacity =
                minDistance <= proximity
                    ? 0.8
                    : minDistance <= fadeDistance
                        ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
                        : 0;

            gsap.to(spotlightRef.current, {
                opacity: targetOpacity,
                duration: targetOpacity > 0 ? 0.2 : 0.5,
                ease: "power2.out",
            });
        };

        const handleMouseLeave = () => {
            const cardsEls = cardRefs.current.filter(Boolean);
            cardsEls.forEach((card) => card.style.setProperty("--glow-intensity", "0"));
            if (spotlightRef.current) {
                gsap.to(spotlightRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out",
                });
            }
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
            spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
            spotlightRef.current = null;
        };
    }, [shouldDisableAnimations, enableSpotlight, spotlightRadius, glowColor]);

    useEffect(() => {
        if (shouldDisableAnimations || (!enableTilt && !enableMagnetism && !clickEffect)) return;

        const cardsEls = cardRefs.current.filter(Boolean);
        const cleanups = [];

        cardsEls.forEach((el) => {
            const handleMouseMove = (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                if (enableTilt) {
                    const rotateX = ((y - centerY) / centerY) * -10;
                    const rotateY = ((x - centerX) / centerX) * 10;

                    gsap.to(el, {
                        rotateX,
                        rotateY,
                        duration: 0.12,
                        ease: "power2.out",
                        transformPerspective: 1000,
                    });
                }

                if (enableMagnetism) {
                    const magnetX = (x - centerX) * 0.05;
                    const magnetY = (y - centerY) * 0.05;

                    gsap.to(el, {
                        x: magnetX,
                        y: magnetY,
                        duration: 0.25,
                        ease: "power2.out",
                    });
                }
            };

            const handleMouseLeave = () => {
                if (enableTilt) {
                    gsap.to(el, {
                        rotateX: 0,
                        rotateY: 0,
                        duration: 0.25,
                        ease: "power2.out",
                    });
                }

                if (enableMagnetism) {
                    gsap.to(el, {
                        x: 0,
                        y: 0,
                        duration: 0.25,
                        ease: "power2.out",
                    });
                }
            };

            const handleClick = (e) => {
                if (!clickEffect) return;

                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const maxDistance = Math.max(
                    Math.hypot(x, y),
                    Math.hypot(x - rect.width, y),
                    Math.hypot(x, y - rect.height),
                    Math.hypot(x - rect.width, y - rect.height),
                );

                const ripple = document.createElement("div");
                ripple.className = "magic-bento-ripple";
                ripple.style.cssText = `
          width: ${maxDistance * 2}px;
          height: ${maxDistance * 2}px;
          left: ${x - maxDistance}px;
          top: ${y - maxDistance}px;
          background: radial-gradient(circle, rgba(${glowColor}, 0.35) 0%, rgba(${glowColor}, 0.15) 35%, transparent 70%);
        `;

                el.appendChild(ripple);

                gsap.fromTo(
                    ripple,
                    { scale: 0, opacity: 1 },
                    {
                        scale: 1,
                        opacity: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        onComplete: () => ripple.remove(),
                    },
                );
            };

            el.addEventListener("mousemove", handleMouseMove);
            el.addEventListener("mouseleave", handleMouseLeave);
            el.addEventListener("click", handleClick);

            cleanups.push(() => {
                el.removeEventListener("mousemove", handleMouseMove);
                el.removeEventListener("mouseleave", handleMouseLeave);
                el.removeEventListener("click", handleClick);
            });
        });

        return () => cleanups.forEach((fn) => fn());
    }, [shouldDisableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

    if (!Array.isArray(cards) || cards.length === 0) return null;

    return (
        <div className={`magic-bento-wrap bento-section ${className}`.trim()}>
            <div className="card-grid" ref={gridRef}>
                {cards.map((card, index) => (
                    <div
                        key={`${card.title}-${index}`}
                        ref={(el) => {
                            cardRefs.current[index] = el;
                        }}
                        className={baseCardClassName}
                        style={{
                            backgroundColor: card.color ?? "rgba(6, 0, 16, 0.55)",
                            "--glow-color": glowColor,
                        }}
                    >
                        <div className="magic-bento-card__header">
                            <div className="magic-bento-card__label">{card.label}</div>
                        </div>
                        <div className="magic-bento-card__content">
                            <h3 className="magic-bento-card__title">{card.title}</h3>
                            <p className="magic-bento-card__description">{card.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
