import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AboutUs.css';

import plant2 from '../../assets/images/Home/plant-2.jpg';
import plant3 from '../../assets/images/Home/plant-3.jpg';
import plant4 from '../../assets/images/Home/plant-4.jpg';
import plant5 from '../../assets/images/Home/plant-5.jpg';
import plant6 from '../../assets/images/Home/plant-6.jpg';

const slideshowImages = [plant2, plant3, plant4, plant5, plant6];

const highlights = [
    {
        num: '01',
        title: 'Quality Guaranteed',
        text: 'Every plant is hand-selected for health and vigour. We inspect each one before it ever reaches your door.',
    },
    {
        num: '02',
        title: 'Expert Care Tips',
        text: 'Simple, friendly guidance for every plant — so beginners thrive just as much as seasoned green thumbs.',
    },
    {
        num: '03',
        title: 'For Every Space',
        text: 'Tiny desk companions to grand statement pieces — we curate the perfect fit for any corner of your life.',
    },
];

const stats = [
    { num: '500', sup: '+', label: 'Plant Varieties' },
    { num: '12K', sup: '', label: 'Happy Customers' },
    { num: '100', sup: '%', label: 'Ethically Sourced' },
    { num: '5★', sup: '', label: 'Average Rating' },
];

export default function About() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % slideshowImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <main>

            {/* ── HERO ── */}
            <section className="about-hero">
                <div className="hero-gold-bar" />
                <div className="hero-ring hero-ring-1" />
                <div className="hero-ring hero-ring-2" />
                <div className="hero-ring hero-ring-3" />

                <div className="hero-inner w-100">
                    <Container>
                        <Row className="align-items-center">

                            {/* LEFT */}
                            <Col lg={6} md={7}>
                                <p className="hero-eyebrow fade-up d0">About Us</p>

                                <h1 className="hero-title fade-up d1">
                                    Where nature<br />
                                    meets{' '}
                                    <span className="gold-word">style</span>
                                    <span className="italic-line">— beautifully.</span>
                                </h1>

                                <div className="hero-divider fade-in d2" />

                                <p className="hero-tagline fade-up d2">
                                    We believe every space deserves something living. Something
                                    that breathes, grows, and quietly transforms the room around it.
                                </p>

                                <div className="hero-scroll-hint fade-up d3">
                                    <div className="scroll-line" />
                                    Scroll to explore
                                </div>
                            </Col>

                            {/* RIGHT — visual with slideshow */}
                            <Col lg={6} md={5} className="d-flex justify-content-center">
                                <div className="hero-visual fade-in d2">

                                    {/* Outer circle */}
                                    <div className="hero-circle-bg">
                                        {slideshowImages.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img}
                                                alt=""
                                                className={`hero-circle-img hero-circle-img--outer slide-img${i === currentIndex ? ' slide-img--active' : ''}`}
                                            />
                                        ))}
                                    </div>

                                    {/* Inner circle — offset by 2 for visual variety */}
                                    <div className="hero-circle-inner">
                                        {slideshowImages.map((img, i) => {
                                            const innerIndex = (currentIndex + 2) % slideshowImages.length;
                                            return (
                                                <img
                                                    key={i}
                                                    src={img}
                                                    alt=""
                                                    className={`hero-circle-img hero-circle-img--inner slide-img${i === innerIndex ? ' slide-img--active' : ''}`}
                                                />
                                            );
                                        })}
                                    </div>

                                    {/* Centre focal image */}
                                    <div className="hero-plant-img-wrap">
                                        {slideshowImages.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img}
                                                alt="Featured plant"
                                                className={`hero-plant-img slide-img${i === currentIndex ? ' slide-img--active' : ''}`}
                                            />
                                        ))}
                                    </div>

                                    {/* Dot indicators */}
                                    <div className="slide-dots">
                                        {slideshowImages.map((_, i) => (
                                            <span
                                                key={i}
                                                className={`slide-dot${i === currentIndex ? ' slide-dot--active' : ''}`}
                                                onClick={() => setCurrentIndex(i)}
                                            />
                                        ))}
                                    </div>

                                    {/* Badges — on top of everything */}
                                    <div className="hero-badge badge-1">
                                        <span className="badge-dot" />
                                        100% natural
                                    </div>
                                    <div className="hero-badge badge-2">
                                        <span className="badge-dot" />
                                        Ethically sourced
                                    </div>
                                    <div className="hero-badge badge-3">
                                        <span className="badge-dot" />
                                        Expert curated
                                    </div>

                                </div>
                            </Col>

                        </Row>
                    </Container>
                </div>
            </section>

            {/* ── STORY ── */}
            <section className="story-section">
                <Container>
                    <Row className="align-items-center g-5">

                        {/* Visual block */}
                        <Col lg={5} md={12} className="order-lg-2">
                            <div className="story-img-block">
                                <div className="story-img-card main">
                                    {slideshowImages.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            alt="Indoor plant collection"
                                            className={`story-card-img slide-img${i === currentIndex ? ' slide-img--active' : ''}`}
                                        />
                                    ))}
                                    <div className="img-overlay-tag">Indoor Collection</div>
                                </div>
                                <div className="story-img-card accent">
                                    {slideshowImages.map((img, i) => {
                                        const accentIndex = (currentIndex + 2) % slideshowImages.length;
                                        return (
                                            <img
                                                key={i}
                                                src={img}
                                                alt="Accent plant"
                                                className={`story-card-img story-card-img--tinted slide-img${i === accentIndex ? ' slide-img--active' : ''}`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </Col>

                        {/* Text block */}
                        <Col lg={7} md={12} className="order-lg-1">
                            <span className="story-number">01</span>
                            <p className="story-eyebrow">Our Story</p>
                            <h2 className="story-heading">
                                Plants that bring{' '}
                                <em>life</em> into<br />every corner
                            </h2>
                            <div className="story-body">
                                <p>
                                    Welcome to our plant shop, where nature meets style. We offer a carefully
                                    selected range of indoor and outdoor plants designed to bring freshness,
                                    beauty, and life into your space.
                                </p>
                                <p>
                                    Whether you're looking for low-maintenance greenery or statement plants,
                                    you'll find something perfect for your home or office. Each plant is chosen
                                    for its quality and health, so you can enjoy long-lasting greenery with
                                    confidence.
                                </p>
                                <p>
                                    We also provide helpful care tips to make plant ownership simple and
                                    enjoyable, no matter your experience level. From small decorative plants
                                    to larger statement pieces, we're here to help you create your own
                                    green corner.
                                </p>
                            </div>
                        </Col>

                    </Row>
                </Container>
            </section>

            {/* ── STATS ── */}
            <section className="stats-band">
                <Container>
                    <Row className="align-items-center justify-content-center">
                        {stats.map((s, i) => (
                            <React.Fragment key={i}>
                                <Col xs={6} md={3}>
                                    <div className="stat-item">
                                        <div className="stat-num">
                                            {s.num}
                                            {s.sup && <sup>{s.sup}</sup>}
                                        </div>
                                        <div className="stat-label">{s.label}</div>
                                    </div>
                                </Col>
                                {i < stats.length - 1 && (
                                    <div className="stat-divider d-none d-md-block" />
                                )}
                            </React.Fragment>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* ── HIGHLIGHTS ── */}
            <section className="highlights-section">
                <Container>
                    <div className="section-header">
                        <div className="section-eyebrow">What we offer</div>
                        <h2 className="section-title-light">
                            Everything you need<br />to grow with confidence
                        </h2>
                    </div>

                    <Row className="g-4">
                        {highlights.map((item, i) => {
                            const cardIndex = (currentIndex + i) % slideshowImages.length;
                            return (
                                <Col key={i} md={4}>
                                    <div className="hi-card">
                                        <div className="hi-card-num">{item.num}</div>
                                        <div className="hi-card-img-wrap">
                                            {slideshowImages.map((img, j) => (
                                                <img
                                                    key={j}
                                                    src={img}
                                                    alt={item.title}
                                                    className={`hi-card-img slide-img${j === cardIndex ? ' slide-img--active' : ''}`}
                                                />
                                            ))}
                                        </div>
                                        <h3>{item.title}</h3>
                                        <p>{item.text}</p>
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>
                </Container>
            </section>

            {/* ── MISSION ── */}
            <section className="mission-section">
                <Container>
                    <Row className="justify-content-center text-center">
                        <Col lg={8}>
                            <div className="mission-eyebrow">Our Mission</div>
                            <p className="mission-quote">
                                "To make plants accessible, affordable, and easy to care for —
                                while promoting a more natural and calming lifestyle."
                            </p>
                            <p className="mission-attr">— The Plant Shop Team</p>
                            <a href="#" className="mission-cta">
                                Shop our plants <span className="cta-arrow">→</span>
                            </a>
                        </Col>
                    </Row>
                </Container>
            </section>

        </main>
    );
}