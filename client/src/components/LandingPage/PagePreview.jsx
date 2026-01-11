import React, { useRef, useEffect, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlurText from '../ui/BlurText';
import './PagePreview.css';
// import '../LandingPage'

gsap.registerPlugin(ScrollTrigger);

// Slides will use images from /public (either /screens/<name>.png OR /<name>.png).
// Add your screenshots under /public/screens or directly under /public.
const slides = [
    {
        id: 1,
        title: 'Smart Data Ingestion',
        description: 'PDF bank & investment statements → clean, structured transactions with auto-categorization.',
        image: '/screens/data_ingestion.jpg'
    },
    {
        id: 2,
        title: 'Spending Intelligence',
        description: 'Tracks expenses, detects overspending, and highlights recurring & wasteful spends.',
        image: 'data:image/png;base64,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'
    },
    {
        id: 3,
        title: 'Investment Insights',
        description: 'Analyzes portfolio allocation, risk balance, and improvement opportunities.',
        image: ''
    },
    {
        id: 4,
        title: 'Goal-Driven Planning',
        description: 'Plan and track goals like savings, travel, or home purchase with progress visibility.',
        image: '/screens/goal_plan.jpg'
    },
    {
        id: 5,
        title: 'Alerts & Nudges',
        description: 'Context-aware alerts for overspending, goal slippage, and portfolio imbalance.',
        image: ''
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
        image: '/screens/agent.jpg'
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
