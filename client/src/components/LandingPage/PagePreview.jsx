import React, { useRef, useEffect, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlurText from '../ui/BlurText';
import './PagePreview.css';

gsap.registerPlugin(ScrollTrigger);

// Slides will use images from /public (either /screens/<name>.png OR /<name>.png).
// Add your screenshots under /public/screens or directly under /public.
const slides = [
    {
        id: 1,
        title: 'Smart Data Ingestion',
        description: 'PDF bank & investment statements → clean, structured transactions with auto-categorization.',
        image: '/screens/ingestion.png'
    },
    {
        id: 2,
        title: 'Spending Intelligence',
        description: 'Tracks expenses, detects overspending, and highlights recurring & wasteful spends.',
        image: '/screens/spending.png'
    },
    {
        id: 3,
        title: 'Investment Insights',
        description: 'Analyzes portfolio allocation, risk balance, and improvement opportunities.',
        image: '/screens/investments.png'
    },
    {
        id: 4,
        title: 'Goal-Driven Planning',
        description: 'Plan and track goals like savings, travel, or home purchase with progress visibility.',
        image: '/screens/goals.png'
    },
    {
        id: 5,
        title: 'Alerts & Nudges',
        description: 'Context-aware alerts for overspending, goal slippage, and portfolio imbalance.',
        image: '/screens/alerts.png'
    },
    {
        id: 6,
        title: 'AI Financial Summary',
        description: 'Clear weekly/monthly summaries explaining what changed and what to do next.',
        image: '/screens/summary.png'
    },
    {
        id: 7,
        title: 'Financial Health Score',
        description: 'Single score reflecting liquidity, stability, growth, and risk management.',
        image: '/screens/score.png'
    },
    {
        id: 8,
        title: 'Multi-Agent AI Core',
        description: 'Independent AI agents coordinated to analyze, plan, and advise holistically.',
        image: '/screens/agents.png'
    }
];

export default function PagePreview() {
    const sectionRef = useRef(null);
    const stageRef = useRef(null);
    const listRef = useRef(null);
    const screenImgRef = useRef(null);
    const [active, setActive] = useState(0);
    const [pinnedMode, setPinnedMode] = useState(false);

    const slidesWithFallback = useMemo(() => {
        return slides.map((s) => ({
            ...s,
            image: s.image || '/screens/placeholder.svg',
        }));
    }, []);

    useEffect(() => {
        const media = window.matchMedia('(min-width: 900px)');
        const update = () => setPinnedMode(Boolean(media.matches));
        update();
        media.addEventListener?.('change', update);
        return () => media.removeEventListener?.('change', update);
    }, []);

    useEffect(() => {
        if (!pinnedMode) return;
        const listEl = listRef.current;
        if (!listEl) return;

        const computeIndex = (progress) => {
            const maxIndex = Math.max(0, slidesWithFallback.length - 1);
            const raw = Math.round(progress * maxIndex);
            return Math.min(maxIndex, Math.max(0, raw));
        };

        const trigger = ScrollTrigger.create({
            trigger: listEl,
            scroller: listEl,
            start: 'top top',
            end: () => {
                const maxScroll = Math.max(1, listEl.scrollHeight - listEl.clientHeight);
                return `+=${maxScroll}`;
            },
            invalidateOnRefresh: true,
            scrub: 0.6,
            onUpdate: (self) => {
                const idx = computeIndex(self.progress);
                setActive((prev) => (prev === idx ? prev : idx));
            },
        });

        requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => {
            trigger.kill();
        };
    }, [pinnedMode, slidesWithFallback.length]);

    useEffect(() => {
        const img = screenImgRef.current;
        if (!img) return;

        gsap.fromTo(
            img,
            { opacity: 0, scale: 1.02 },
            { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' },
        );
    }, [active]);

    return (
        <section ref={sectionRef} className="page-preview-section">
            {/*
              Preview images come from /public/screens/*.png (preferred) or /public/*.png.
              The laptop frame image is /public/laptop-image.avif.
            */}

            <div ref={stageRef} className="page-preview-stage">
                <div className="page-preview-inner">
                    <div className="preview-left" ref={listRef}>
                        {pinnedMode ? (
                            <>
                                <div className="preview-single">
                                    <BlurText
                                        key={slidesWithFallback[active]?.title}
                                        text={slidesWithFallback[active]?.title}
                                        delay={70}
                                        className="preview-title"
                                        direction="top"
                                        threshold={0.2}
                                        rootMargin="0px"
                                    />
                                    <p className="preview-desc">{slidesWithFallback[active]?.description}</p>
                                    <div className="preview-step">
                                        <span className="preview-step-pill">
                                            {active + 1}/{slidesWithFallback.length}
                                        </span>
                                    </div>
                                </div>
                                {/* Scroll spacers to drive the local scroll */}
                                <div className="preview-scroll-spacers" aria-hidden="true">
                                    {slidesWithFallback.map((s, i) => (
                                        <div key={s.id ?? i} className="preview-spacer-item" />
                                    ))}
                                </div>
                            </>
                        ) : (
                            slidesWithFallback.map((s, i) => (
                                <div key={s.id ?? i} className="preview-text-item">
                                    <BlurText
                                        text={s.title}
                                        delay={70}
                                        className="preview-title"
                                        direction="top"
                                        threshold={0.35}
                                        rootMargin="0px 0px -15% 0px"
                                    />
                                    <p className="preview-desc">{s.description}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="preview-right">
                        <div className="laptop-wrap">
                            <img src="/laptop-image.avif" className="laptop-image" alt="laptop" />
                            <div className="laptop-screen">
                                <img
                                    ref={screenImgRef}
                                    src={slidesWithFallback[active]?.image}
                                    alt={slidesWithFallback[active]?.title}
                                    className="screen-image"
                                    onError={(e) => {
                                        const img = e.currentTarget;
                                        const stage = img.dataset.fallbackStage || '0';
                                        const current = img.getAttribute('src') || '';

                                        if (stage === '0' && current.startsWith('/screens/')) {
                                            img.dataset.fallbackStage = '1';
                                            img.src = current.replace('/screens/', '/');
                                            return;
                                        }

                                        if (stage === '0' || stage === '1') {
                                            img.dataset.fallbackStage = '2';
                                            img.src = '/screens/placeholder.svg';
                                            return;
                                        }

                                        img.style.display = 'none';
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
