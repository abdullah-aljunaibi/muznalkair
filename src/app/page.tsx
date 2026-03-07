"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IslamicPattern from "@/components/IslamicPattern";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">

        {/* ═══════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════ */}
        <section
          style={{
            background: "#FAF4EE",
            paddingTop: "100px",
            paddingBottom: "100px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Gold glow — top right */}
          <div style={{
            position: "absolute", borderRadius: "50%", pointerEvents: "none",
            width: "600px", height: "600px",
            background: "radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)",
            top: "-150px", right: "-150px",
          }} />
          {/* Teal glow — bottom left */}
          <div style={{
            position: "absolute", borderRadius: "50%", pointerEvents: "none",
            width: "500px", height: "500px",
            background: "radial-gradient(circle, rgba(27,107,122,0.08) 0%, transparent 70%)",
            bottom: "-100px", left: "-100px",
          }} />
          {/* Calligraphy watermark */}
          <div style={{
            position: "absolute", fontSize: "18rem", opacity: 0.03,
            fontFamily: "var(--font-amiri)", color: "#1B6B7A",
            userSelect: "none", pointerEvents: "none", whiteSpace: "nowrap",
            top: "50%", right: "-5%", transform: "translateY(-50%)",
          }}>القرآن</div>

          <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem", textAlign: "center" }}>
            {/* Pill tag */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "6px 18px", borderRadius: "50px",
              background: "rgba(212,175,55,0.15)",
              color: "#D4AF37",
              border: "1px solid rgba(212,175,55,0.3)",
              fontFamily: "var(--font-tajawal)",
              fontSize: "0.9rem",
              marginBottom: "1.5rem",
            }}>
              ✨ مقرأة نسائية تطوعية ١٠٠٪
            </div>

            {/* H1 */}
            <h1 style={{
              fontFamily: "var(--font-amiri)",
              fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
              color: "#1A0A00",
              lineHeight: 1.25,
              marginBottom: "1.5rem",
              fontWeight: "bold",
            }}>
              أول مقرأة عُمانية نسائية
              <br />
              تطوعية لتعليم القرآن الكريم
            </h1>

            {/* Body */}
            <p style={{
              fontFamily: "var(--font-tajawal)",
              fontSize: "1.2rem",
              color: "#4A3828",
              lineHeight: "1.8",
              maxWidth: "600px",
              margin: "0 auto 2.5rem",
            }}>
              حلقات تصحيح تلاوة ممتدة من الفجر حتى المساء — لكل مستوى ومسار
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
              <Link
                href="/register"
                style={{
                  display: "inline-block",
                  padding: "14px 36px",
                  borderRadius: "50px",
                  background: "#0A2830",
                  color: "white",
                  fontFamily: "var(--font-tajawal)",
                  fontSize: "1.05rem",
                  fontWeight: "600",
                  textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(10,40,48,0.25)",
                  transition: "all 0.3s ease",
                }}
              >
                انضمي الآن ←
              </Link>
              <a
                href="#programs"
                style={{
                  display: "inline-block",
                  padding: "14px 36px",
                  borderRadius: "50px",
                  background: "transparent",
                  color: "#D4AF37",
                  fontFamily: "var(--font-tajawal)",
                  fontSize: "1.05rem",
                  fontWeight: "600",
                  textDecoration: "none",
                  border: "2px solid #D4AF37",
                  transition: "all 0.3s ease",
                }}
              >
                تعرفي على البرامج
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            STATS BAR
        ═══════════════════════════════════════════ */}
        <section style={{
          background: "linear-gradient(135deg, #0A2830 0%, #051820 100%)",
          borderTop: "1px solid rgba(212,175,55,0.2)",
          borderBottom: "1px solid rgba(212,175,55,0.2)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Star particles */}
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              width: `${(i % 3) + 1}px`, height: `${(i % 3) + 1}px`,
              background: `rgba(255,255,255,${0.2 + (i % 5) * 0.1})`,
              borderRadius: "50%",
              top: `${(i * 17 + 7) % 100}%`,
              left: `${(i * 23 + 11) % 100}%`,
              pointerEvents: "none",
            }} />
          ))}
          <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", textAlign: "center" }}>
              {[
                { number: "٣ آلاف+", label: "طالبة" },
                { number: "٥", label: "ختمات مكتملة" },
                { number: "٣", label: "مسارات حفظ" },
                { number: "من ٤ فجرًا حتى ٦ مساءً", label: "أوقات الحلقات" },
              ].map((stat, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{
                    fontFamily: "var(--font-amiri)",
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    color: "#D4AF37",
                  }}>
                    {stat.number}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-tajawal)",
                    fontSize: "0.95rem",
                    color: "rgba(255,255,255,0.7)",
                  }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            ABOUT SECTION
        ═══════════════════════════════════════════ */}
        <section id="about" style={{
          background: "#FAF4EE",
          padding: "80px 0",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Subtle gold glow */}
          <div style={{
            position: "absolute", borderRadius: "50%", pointerEvents: "none",
            width: "400px", height: "400px",
            background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)",
            bottom: "-100px", right: "10%",
          }} />

          <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
              {/* Text Block */}
              <div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "6px 16px", borderRadius: "50px",
                  background: "rgba(212,175,55,0.15)",
                  color: "#D4AF37",
                  border: "1px solid rgba(212,175,55,0.3)",
                  fontFamily: "var(--font-tajawal)",
                  fontSize: "0.875rem",
                  marginBottom: "1rem",
                }}>
                  تعرفي علينا
                </div>
                <h2 style={{
                  fontFamily: "var(--font-amiri)",
                  fontSize: "clamp(2rem, 3.5vw, 3rem)",
                  color: "#1A0A00",
                  fontWeight: "bold",
                  marginBottom: "1.5rem",
                }}>
                  من نحن
                </h2>
                <p style={{
                  fontFamily: "var(--font-tajawal)",
                  fontSize: "1.05rem",
                  color: "#4A3828",
                  lineHeight: "1.9",
                  marginBottom: "1rem",
                }}>
                  مقرأة مُزن الخير أول مقرأة عُمانية نسائية تطوعية، تُقدّم حلقات تصحيح
                  تلاوة وتحفيظ القرآن الكريم عن بُعد، بأوقات ممتدة طوال اليوم لتناسب
                  جميع المستويات والأعمار.
                </p>
                <p style={{
                  fontFamily: "var(--font-tajawal)",
                  fontSize: "0.95rem",
                  color: "#7A6555",
                  lineHeight: "1.9",
                }}>
                  نؤمن بأن تعلّم القرآن الكريم حق لكل مسلمة، لذا نُقدّم خدماتنا
                  بروح تطوعية خالصة، مع الحفاظ على أعلى مستويات الجودة في التعليم
                  والإسناد.
                </p>

                {/* Small stat cards */}
                <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
                  {[
                    { num: "٥+", label: "سنوات خبرة" },
                    { num: "٢٠+", label: "معلمة متطوعة" },
                    { num: "٢٤/٧", label: "حلقات متاحة" },
                  ].map((s, i) => (
                    <div key={i} style={{
                      padding: "14px 20px",
                      borderRadius: "14px",
                      background: "rgba(27,107,122,0.06)",
                      border: "1px solid rgba(27,107,122,0.2)",
                      textAlign: "center",
                      minWidth: "90px",
                    }}>
                      <div style={{
                        fontFamily: "var(--font-amiri)",
                        fontSize: "1.6rem",
                        fontWeight: "bold",
                        color: "#1B6B7A",
                      }}>{s.num}</div>
                      <div style={{
                        fontFamily: "var(--font-tajawal)",
                        fontSize: "0.8rem",
                        color: "#7A6555",
                        marginTop: "2px",
                      }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote Card */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{
                  position: "relative",
                  padding: "2.5rem",
                  borderRadius: "24px",
                  background: "linear-gradient(135deg, #0A2830, #0D3D47)",
                  border: "1px solid rgba(212,175,55,0.2)",
                  maxWidth: "380px",
                  width: "100%",
                  overflow: "hidden",
                }}>
                  {/* 5 Star particles on the card */}
                  {[...Array(5)].map((_, i) => (
                    <div key={i} style={{
                      position: "absolute",
                      width: `${(i % 3) + 1}px`, height: `${(i % 3) + 1}px`,
                      background: `rgba(255,255,255,${0.3 + (i % 3) * 0.1})`,
                      borderRadius: "50%",
                      top: `${(i * 19 + 5) % 100}%`,
                      left: `${(i * 21 + 15) % 100}%`,
                      pointerEvents: "none",
                    }} />
                  ))}
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{
                      fontSize: "4rem",
                      lineHeight: 1,
                      color: "#D4AF37",
                      opacity: 0.5,
                      marginBottom: "1rem",
                      fontFamily: "serif",
                    }}>❝</div>
                    <p style={{
                      fontFamily: "var(--font-amiri)",
                      fontSize: "1.5rem",
                      color: "white",
                      lineHeight: "1.8",
                      marginBottom: "1.5rem",
                    }}>
                      خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
                    </p>
                    <p style={{
                      fontFamily: "var(--font-tajawal)",
                      fontSize: "0.875rem",
                      color: "rgba(212,175,55,0.8)",
                      textAlign: "right",
                    }}>
                      — رواه البخاري
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            PROGRAMS SECTION
        ═══════════════════════════════════════════ */}
        <section
          id="programs"
          style={{
            background: "#FAF4EE",
            padding: "80px 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "6px 18px", borderRadius: "50px",
                background: "rgba(212,175,55,0.15)",
                color: "#D4AF37",
                border: "1px solid rgba(212,175,55,0.3)",
                fontFamily: "var(--font-tajawal)",
                fontSize: "0.875rem",
                marginBottom: "1rem",
              }}>
                برامجنا
              </div>
              <h2 style={{
                fontFamily: "var(--font-amiri)",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                color: "#1A0A00",
                fontWeight: "bold",
              }}>
                مساراتنا التعليمية
              </h2>
              <p style={{
                fontFamily: "var(--font-tajawal)",
                fontSize: "1rem",
                color: "#7A6555",
                marginTop: "0.75rem",
                maxWidth: "480px",
                margin: "0.75rem auto 0",
              }}>
                ثلاثة مسارات متخصصة تلبي احتياجات كل طالبة
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              {[
                {
                  num: "١",
                  title: "المقرأة العامة",
                  desc: "تصحيح التلاوة لجميع المستويات، من المبتدئة إلى المتقدمة، مع تعلّم أحكام التجويد.",
                  tag: "يوميًا من الفجر",
                  icon: (
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "40px", height: "40px" }}>
                      <rect x="5" y="8" width="30" height="24" rx="3" stroke="#1B6B7A" strokeWidth="2" />
                      <line x1="20" y1="8" x2="20" y2="32" stroke="#1B6B7A" strokeWidth="1.5" />
                      <line x1="10" y1="16" x2="17" y2="16" stroke="#1B6B7A" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="10" y1="20" x2="17" y2="20" stroke="#1B6B7A" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="10" y1="24" x2="17" y2="24" stroke="#1B6B7A" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="23" y1="16" x2="30" y2="16" stroke="#1B6B7A" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="23" y1="20" x2="30" y2="20" stroke="#1B6B7A" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="23" y1="24" x2="30" y2="24" stroke="#1B6B7A" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ),
                },
                {
                  num: "٢",
                  title: "مقرأة الأمهات",
                  desc: "مخصصة للأمهات المشغولات بأوقات مرنة تناسب جدولهن اليومي مع أطفالهن.",
                  tag: "أوقات مرنة",
                  icon: (
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "40px", height: "40px" }}>
                      <circle cx="20" cy="14" r="6" stroke="#1B6B7A" strokeWidth="2" />
                      <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#1B6B7A" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="30" cy="22" r="4" stroke="#D4AF37" strokeWidth="1.5" />
                      <path d="M26 34c0-4 1.8-7 4-7" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ),
                },
                {
                  num: "٣",
                  title: "برنامج الأترجة",
                  desc: "لتحفيظ القرآن الكريم بمسارات متعددة — جزء واحد، خمسة أجزاء، أو ختمة كاملة.",
                  tag: "٣ مسارات حفظ",
                  icon: (
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "40px", height: "40px" }}>
                      <path d="M20 5 L23 15 H33 L25 21 L28 31 L20 25 L12 31 L15 21 L7 15 H17 Z" stroke="#1B6B7A" strokeWidth="2" fill="rgba(27,107,122,0.1)" />
                      <circle cx="20" cy="20" r="4" fill="#D4AF37" />
                    </svg>
                  ),
                },
              ].map((program, i) => (
                <div
                  key={i}
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    padding: "2rem",
                    border: "1px solid rgba(212,175,55,0.15)",
                    boxShadow: "0 4px 24px rgba(27,107,122,0.08)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 40px rgba(27,107,122,0.15)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(27,107,122,0.08)";
                  }}
                >
                  {/* Icon container */}
                  <div style={{
                    width: "56px", height: "56px",
                    borderRadius: "14px",
                    background: "rgba(27,107,122,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "1.25rem",
                  }}>
                    {program.icon}
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: "var(--font-amiri)",
                    fontSize: "1.4rem",
                    fontWeight: "bold",
                    color: "#1A0A00",
                    marginBottom: "0.75rem",
                  }}>
                    {program.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontFamily: "var(--font-tajawal)",
                    fontSize: "0.95rem",
                    color: "#4A3828",
                    lineHeight: "1.8",
                    marginBottom: "1.25rem",
                  }}>
                    {program.desc}
                  </p>

                  {/* Pill tag */}
                  <span style={{
                    display: "inline-flex", alignItems: "center",
                    padding: "5px 14px",
                    borderRadius: "50px",
                    background: "rgba(212,175,55,0.12)",
                    color: "#D4AF37",
                    border: "1px solid rgba(212,175,55,0.25)",
                    fontFamily: "var(--font-tajawal)",
                    fontSize: "0.8rem",
                    fontWeight: "500",
                  }}>
                    🕐 {program.tag}
                  </span>

                  {/* Number badge — gold */}
                  <div style={{
                    position: "absolute",
                    bottom: "1.25rem",
                    left: "1.25rem",
                    width: "32px", height: "32px",
                    borderRadius: "50%",
                    background: "#D4AF37",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white",
                    fontFamily: "var(--font-amiri)",
                    fontSize: "0.95rem",
                    fontWeight: "bold",
                  }}>
                    {program.num}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            COURSES SECTION
        ═══════════════════════════════════════════ */}
        <section id="courses" style={{
          background: "#FAF4EE",
          padding: "80px 0",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Subtle teal glow */}
          <div style={{
            position: "absolute", borderRadius: "50%", pointerEvents: "none",
            width: "500px", height: "500px",
            background: "radial-gradient(circle, rgba(27,107,122,0.05) 0%, transparent 70%)",
            top: "0", left: "-100px",
          }} />

          <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "6px 18px", borderRadius: "50px",
                background: "rgba(212,175,55,0.15)",
                color: "#D4AF37",
                border: "1px solid rgba(212,175,55,0.3)",
                fontFamily: "var(--font-tajawal)",
                fontSize: "0.875rem",
                marginBottom: "1rem",
              }}>
                دوراتنا
              </div>
              <h2 style={{
                fontFamily: "var(--font-amiri)",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                color: "#1A0A00",
                fontWeight: "bold",
              }}>
                الدورات المتاحة
              </h2>
              <p style={{
                fontFamily: "var(--font-tajawal)",
                fontSize: "1rem",
                color: "#7A6555",
                marginTop: "0.75rem",
                maxWidth: "480px",
                margin: "0.75rem auto 0",
              }}>
                اختاري الدورة المناسبة لمستواك وابدئي رحلتك مع القرآن الكريم
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
              {[
                {
                  title: "دورة تصحيح التلاوة للمبتدئات",
                  desc: "تعلمي أساسيات التلاوة الصحيحة من الصفر، مع شرح مبسّط لأحكام التجويد الأساسية.",
                  price: "٥ ريالات",
                  level: "مبتدئة",
                  lessons: "١٢ درس",
                  duration: "٤ أسابيع",
                  gradientFrom: "#0A2830",
                  gradientTo: "#1B6B7A",
                },
                {
                  title: "دورة أحكام التجويد المتكاملة",
                  desc: "غطّي جميع أحكام التجويد بشكل تفصيلي مع تطبيق عملي مكثّف على آيات قرآنية.",
                  price: "٨ ريالات",
                  level: "متوسطة",
                  lessons: "٢٠ درس",
                  duration: "٦ أسابيع",
                  gradientFrom: "#2C1A00",
                  gradientTo: "#9E7E2C",
                },
                {
                  title: "برنامج حفظ جزء عمّ",
                  desc: "احفظي جزء عمّ كاملًا بطريقة منهجية مع مراجعة يومية وتثبيت الحفظ.",
                  price: "١٠ ريالات",
                  level: "جميع المستويات",
                  lessons: "٣٠ درس",
                  duration: "٨ أسابيع",
                  gradientFrom: "#0A2830",
                  gradientTo: "#0D3D47",
                },
                {
                  title: "دورة الأمهات — التلاوة اليومية",
                  desc: "مخصصة للأمهات المشغولات — جلسات قصيرة ومرنة لا تتجاوز ٣٠ دقيقة يوميًا.",
                  price: "٥ ريالات",
                  level: "مبتدئة ومتوسطة",
                  lessons: "١٦ درس",
                  duration: "٤ أسابيع",
                  gradientFrom: "#1A0022",
                  gradientTo: "#7B2D8B",
                },
                {
                  title: "برنامج حفظ خمسة أجزاء",
                  desc: "مسار منظم لحفظ خمسة أجزاء من القرآن الكريم مع مراجعة أسبوعية مع المعلمة.",
                  price: "١٥ ريالًا",
                  level: "متقدمة",
                  lessons: "٤٠ درس",
                  duration: "٣ أشهر",
                  gradientFrom: "#0A2830",
                  gradientTo: "#163D4A",
                },
                {
                  title: "دورة المقرأة العامة — المستوى المتقدم",
                  desc: "للطالبات المتقدمات اللواتي يرغبن في صقل تلاوتهن والاستعداد للإجازة القرآنية.",
                  price: "١٢ ريالًا",
                  level: "متقدمة",
                  lessons: "٢٤ درس",
                  duration: "٦ أسابيع",
                  gradientFrom: "#0C2810",
                  gradientTo: "#1B5E20",
                },
              ].map((course, i) => (
                <div
                  key={i}
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "1px solid rgba(212,175,55,0.15)",
                    boxShadow: "0 4px 24px rgba(27,107,122,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 40px rgba(27,107,122,0.14)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(27,107,122,0.06)";
                  }}
                >
                  {/* Gradient thumbnail with Islamic pattern feel */}
                  <div style={{
                    height: "100px",
                    background: `linear-gradient(135deg, ${course.gradientFrom}, ${course.gradientTo})`,
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    {/* Decorative circle patterns */}
                    <div style={{
                      position: "absolute", width: "120px", height: "120px",
                      border: "1px solid rgba(212,175,55,0.2)", borderRadius: "50%",
                      top: "-20px", right: "-20px",
                    }} />
                    <div style={{
                      position: "absolute", width: "80px", height: "80px",
                      border: "1px solid rgba(212,175,55,0.15)", borderRadius: "50%",
                      bottom: "-30px", left: "20px",
                    }} />
                    {/* Level badge on thumbnail */}
                    <span style={{
                      position: "relative",
                      zIndex: 1,
                      padding: "5px 14px",
                      borderRadius: "50px",
                      background: "rgba(212,175,55,0.2)",
                      color: "#D4AF37",
                      border: "1px solid rgba(212,175,55,0.4)",
                      fontFamily: "var(--font-tajawal)",
                      fontSize: "0.8rem",
                    }}>
                      {course.level}
                    </span>
                  </div>

                  <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
                    {/* Title */}
                    <h3 style={{
                      fontFamily: "var(--font-amiri)",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "#1A0A00",
                      marginBottom: "0.75rem",
                    }}>
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p style={{
                      fontFamily: "var(--font-tajawal)",
                      fontSize: "0.9rem",
                      color: "#4A3828",
                      lineHeight: "1.8",
                      marginBottom: "1rem",
                      flex: 1,
                    }}>
                      {course.desc}
                    </p>

                    {/* Meta */}
                    <div style={{
                      display: "flex", gap: "1rem",
                      fontFamily: "var(--font-tajawal)",
                      fontSize: "0.8rem",
                      color: "#7A6555",
                      marginBottom: "1.25rem",
                    }}>
                      <span>📚 {course.lessons}</span>
                      <span>⏱ {course.duration}</span>
                    </div>

                    {/* Price + CTA */}
                    <div style={{
                      borderTop: "1px solid rgba(212,175,55,0.15)",
                      paddingTop: "1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                      <span style={{
                        fontFamily: "var(--font-amiri)",
                        fontSize: "1.4rem",
                        fontWeight: "bold",
                        color: "#D4AF37",
                      }}>
                        {course.price}
                      </span>
                      <Link
                        href="/checkout"
                        style={{
                          display: "inline-block",
                          padding: "9px 22px",
                          borderRadius: "50px",
                          background: "#0A2830",
                          color: "white",
                          fontFamily: "var(--font-tajawal)",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          textDecoration: "none",
                          transition: "all 0.3s ease",
                        }}
                      >
                        سجّلي الآن
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            HOW IT WORKS SECTION
        ═══════════════════════════════════════════ */}
        <section style={{
          background: "linear-gradient(180deg, #FAF4EE 0%, #F0EBE3 100%)",
          padding: "80px 0",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Subtle glow */}
          <div style={{
            position: "absolute", borderRadius: "50%", pointerEvents: "none",
            width: "400px", height: "400px",
            background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)",
            top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          }} />

          <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2 style={{
                fontFamily: "var(--font-amiri)",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                color: "#1A0A00",
                fontWeight: "bold",
              }}>
                كيف تنضمين؟
              </h2>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 0 }}>
              {[
                { step: "١", title: "سجّلي", desc: "أنشئي حسابك في دقيقتين" },
                { step: "٢", title: "اختاري مسارك", desc: "حددي البرنامج المناسب لمستواك" },
                { step: "٣", title: "ابدئي رحلتك", desc: "انضمي إلى الحلقات وابدئي التعلّم" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ textAlign: "center", padding: "1rem 2rem", minWidth: "200px" }}>
                    {/* Step circle */}
                    <div style={{
                      width: "64px", height: "64px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #D4AF37, #9E7E2C)",
                      boxShadow: "0 4px 20px rgba(212,175,55,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 1rem",
                      color: "white",
                      fontFamily: "var(--font-amiri)",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                    }}>
                      {item.step}
                    </div>
                    <h3 style={{
                      fontFamily: "var(--font-amiri)",
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      color: "#1A0A00",
                      marginBottom: "0.5rem",
                    }}>
                      {item.title}
                    </h3>
                    <p style={{
                      fontFamily: "var(--font-tajawal)",
                      fontSize: "0.9rem",
                      color: "#7A6555",
                    }}>
                      {item.desc}
                    </p>
                  </div>
                  {/* Connector */}
                  {i < 2 && (
                    <div style={{
                      width: "60px",
                      height: "2px",
                      background: "linear-gradient(90deg, #D4AF37, #1B6B7A)",
                      flexShrink: 0,
                      display: "none",
                    }} className="md-connector" />
                  )}
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
              <Link
                href="/register"
                style={{
                  display: "inline-block",
                  padding: "14px 40px",
                  borderRadius: "50px",
                  background: "#0A2830",
                  color: "white",
                  fontFamily: "var(--font-tajawal)",
                  fontSize: "1.05rem",
                  fontWeight: "600",
                  textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(10,40,48,0.25)",
                  transition: "all 0.3s ease",
                }}
              >
                سجّلي الآن مجانًا
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            ACHIEVEMENTS SECTION
        ═══════════════════════════════════════════ */}
        <section style={{
          background: "linear-gradient(135deg, #0A2830 0%, #041218 50%, #0A2830 100%)",
          padding: "80px 0",
          position: "relative",
          overflow: "hidden",
        }}>
          <IslamicPattern />

          {/* 30 star particles */}
          {[...Array(30)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              width: `${(i % 3) + 1}px`, height: `${(i % 3) + 1}px`,
              background: `rgba(255,255,255,${0.15 + (i % 5) * 0.08})`,
              borderRadius: "50%",
              top: `${(i * 13 + 7) % 100}%`,
              left: `${(i * 17 + 11) % 100}%`,
              pointerEvents: "none",
            }} />
          ))}

          {/* Gold radial glow at center */}
          <div style={{
            position: "absolute", borderRadius: "50%", pointerEvents: "none",
            width: "700px", height: "700px",
            background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 65%)",
            top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          }} />

          {/* Faded "إنجازاتنا" watermark — behind content */}
          <div style={{
            position: "absolute", fontSize: "10rem", opacity: 0.025,
            fontFamily: "var(--font-amiri)", color: "#D4AF37",
            userSelect: "none", pointerEvents: "none", whiteSpace: "nowrap",
            top: "10%", right: "50%", transform: "translateX(50%)",
            zIndex: 0,
          }}>إنجازاتنا</div>

          <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2 style={{
                fontFamily: "var(--font-amiri)",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                color: "white",
                fontWeight: "bold",
              }}>
                إنجازاتنا
              </h2>
              <p style={{
                fontFamily: "var(--font-tajawal)",
                fontSize: "1rem",
                color: "rgba(212,175,55,0.7)",
                marginTop: "0.75rem",
              }}>
                أرقام تعكس ثقة طالباتنا بنا
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
              {[
                {
                  icon: (
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                      <rect x="4" y="6" width="28" height="24" rx="3" stroke="#D4AF37" strokeWidth="1.8"/>
                      <line x1="18" y1="6" x2="18" y2="30" stroke="#D4AF37" strokeWidth="1.4"/>
                      <line x1="8" y1="13" x2="15" y2="13" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round"/>
                      <line x1="8" y1="18" x2="15" y2="18" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round"/>
                      <line x1="8" y1="23" x2="15" y2="23" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round"/>
                      <line x1="21" y1="13" x2="28" y2="13" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round"/>
                      <line x1="21" y1="18" x2="28" y2="18" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round"/>
                      <line x1="21" y1="23" x2="28" y2="23" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  ),
                  number: "٥", label: "ختمات قرآنية مكتملة", sub: "ختمنا القرآن جماعيًا"
                },
                {
                  icon: (
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                      <circle cx="18" cy="13" r="6" stroke="#D4AF37" strokeWidth="1.8"/>
                      <path d="M6 32c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  ),
                  number: "٣٠٠٠+", label: "طالبة مسجّلة", sub: "من عُمان والعالم العربي"
                },
                {
                  icon: (
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                      <path d="M18 4 L21 13 H31 L23 19 L26 28 L18 22 L10 28 L13 19 L5 13 H15 Z" stroke="#D4AF37" strokeWidth="1.8" fill="rgba(212,175,55,0.1)"/>
                    </svg>
                  ),
                  number: "٥", label: "سنوات من العطاء", sub: "منذ ٢٠١٩م"
                },
                {
                  icon: (
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                      <path d="M4 28 L4 16 Q4 12 8 12 L10 12 L10 10 Q10 6 18 6 Q26 6 26 10 L26 12 L28 12 Q32 12 32 16 L32 28 Z" stroke="#D4AF37" strokeWidth="1.8" fill="rgba(212,175,55,0.08)"/>
                      <rect x="14" y="20" width="8" height="8" rx="1" stroke="#D4AF37" strokeWidth="1.4"/>
                      <line x1="4" y1="28" x2="32" y2="28" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  ),
                  number: "٣", label: "مسارات تعليمية", sub: "لكل مستوى وعمر"
                },
              ].map((ach, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(212,175,55,0.2)",
                  backdropFilter: "blur(16px)",
                  borderRadius: "20px",
                  padding: "2rem",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>{ach.icon}</div>
                  <div style={{
                    fontFamily: "var(--font-amiri)",
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    color: "#D4AF37",
                    marginBottom: "0.5rem",
                  }}>
                    {ach.number}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-tajawal)",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    color: "white",
                    marginBottom: "0.25rem",
                  }}>
                    {ach.label}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-tajawal)",
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.5)",
                  }}>
                    {ach.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            REVIEWS SECTION
        ═══════════════════════════════════════════ */}
        <section style={{
          background: "#FAF4EE",
          padding: "80px 0",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Subtle glow */}
          <div style={{
            position: "absolute", borderRadius: "50%", pointerEvents: "none",
            width: "500px", height: "500px",
            background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)",
            top: "-100px", left: "50%", transform: "translateX(-50%)",
          }} />

          <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2 style={{
                fontFamily: "var(--font-amiri)",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                color: "#1A0A00",
                fontWeight: "bold",
              }}>
                ماذا تقول طالباتنا
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {[
                {
                  name: "أم عبدالله المرزوقية",
                  initials: "أع",
                  review: "الحمد لله، بعد سنوات من محاولة تصحيح تلاوتي وجدت مقرأة مُزن الخير. المعلمات متخصصات ومتفانيات، والحلقات منظمة جدًا. تحسّنت تلاوتي بشكل ملحوظ خلال شهرين فقط.",
                  stars: 5,
                },
                {
                  name: "فاطمة البلوشية",
                  initials: "فب",
                  review: "أنصح كل أم بالانضمام لمقرأة الأمهات. الأوقات مرنة جدًا وتناسب جدولي مع أطفالي. المعلمة صبورة ومتفهمة. جزاهم الله خيرًا على هذا العمل التطوعي النبيل.",
                  stars: 5,
                },
                {
                  name: "نور العلوية",
                  initials: "نع",
                  review: "التحقت ببرنامج الأترجة لحفظ عشرة أجزاء، والحمد لله أتممت الهدف مع دعم رائع من المعلمة وزميلات الحلقة. بيئة علمية جادة ومشجّعة في نفس الوقت.",
                  stars: 5,
                },
              ].map((review, i) => (
                <div key={i} style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "2rem",
                  borderRight: "4px solid #D4AF37",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  {/* Large quote mark background */}
                  <div style={{
                    position: "absolute",
                    top: "0.5rem",
                    right: "1rem",
                    fontSize: "6rem",
                    fontFamily: "serif",
                    color: "#D4AF37",
                    opacity: 0.08,
                    lineHeight: 1,
                    userSelect: "none",
                    pointerEvents: "none",
                  }}>❝</div>

                  {/* Stars */}
                  <div style={{ display: "flex", gap: "4px", marginBottom: "1rem" }}>
                    {Array.from({ length: review.stars }).map((_, j) => (
                      <span key={j} style={{ color: "#D4AF37", fontSize: "1rem" }}>★</span>
                    ))}
                  </div>

                  {/* Quote text */}
                  <p style={{
                    fontFamily: "var(--font-tajawal)",
                    fontSize: "0.9rem",
                    color: "#4A3828",
                    lineHeight: "1.9",
                    marginBottom: "1.5rem",
                    position: "relative",
                  }}>
                    &ldquo;{review.review}&rdquo;
                  </p>

                  {/* Reviewer */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "42px", height: "42px",
                      borderRadius: "50%",
                      background: "#0A2830",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white",
                      fontFamily: "var(--font-amiri)",
                      fontSize: "0.95rem",
                      fontWeight: "bold",
                      flexShrink: 0,
                    }}>
                      {review.initials}
                    </div>
                    <span style={{
                      fontFamily: "var(--font-tajawal)",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      color: "#1A0A00",
                    }}>
                      {review.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            PRICING / JOIN SECTION
        ═══════════════════════════════════════════ */}
        <section style={{
          background: "linear-gradient(135deg, #0A2830 0%, #051820 100%)",
          padding: "80px 0",
          position: "relative",
          overflow: "hidden",
        }}>
          <IslamicPattern />

          {/* 20 star particles */}
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              width: `${(i % 3) + 1}px`, height: `${(i % 3) + 1}px`,
              background: `rgba(255,255,255,${0.2 + (i % 5) * 0.1})`,
              borderRadius: "50%",
              top: `${(i * 17 + 7) % 100}%`,
              left: `${(i * 23 + 11) % 100}%`,
              pointerEvents: "none",
            }} />
          ))}

          {/* Gold glow */}
          <div style={{
            position: "absolute", borderRadius: "50%", pointerEvents: "none",
            width: "600px", height: "600px",
            background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 65%)",
            top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          }} />

          <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2 style={{
                fontFamily: "var(--font-amiri)",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                color: "white",
                fontWeight: "bold",
                marginBottom: "0.75rem",
              }}>
                انضمي إلى برامجنا
              </h2>
              <p style={{
                fontFamily: "var(--font-tajawal)",
                fontSize: "1rem",
                color: "rgba(255,255,255,0.6)",
              }}>
                اختاري طريقة التسجيل الأنسب لك
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", maxWidth: "700px", margin: "0 auto" }}>
              {/* Card 1: Stripe / Online Payment */}
              <div style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(16px)",
                borderRadius: "20px",
                padding: "2rem",
                textAlign: "center",
              }}>
                {/* Stripe icon */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect width="48" height="48" rx="12" fill="#635BFF" />
                    <path
                      d="M22 18c0-1.3 1.1-2 2.7-2 2.4 0 4.8.7 6.3 1.7V13c-1.7-.7-3.4-1-6.3-1C20.7 12 17 14.2 17 18.4c0 6.5 9 5.5 9 8.3 0 1.5-1.3 2-3 2-2.6 0-5.9-1.1-7.7-2.5v5.5c1.6.7 3.5 1.3 7.7 1.3C27.8 33 32 30.7 32 26.4c0-7-9-5.8-9-8.4z"
                      fill="white"
                    />
                  </svg>
                </div>
                <h3 style={{
                  fontFamily: "var(--font-amiri)",
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: "0.5rem",
                }}>
                  الدفع الإلكتروني
                </h3>
                <p style={{
                  fontFamily: "var(--font-tajawal)",
                  fontSize: "0.9rem",
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: "1.5rem",
                }}>
                  الدفع الآمن عبر بطاقتك
                </p>
                <Link
                  href="/checkout"
                  style={{
                    display: "block",
                    padding: "12px 24px",
                    borderRadius: "50px",
                    background: "#1B6B7A",
                    color: "white",
                    fontFamily: "var(--font-tajawal)",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  ادفعي الآن
                </Link>
              </div>

              {/* Card 2: WhatsApp */}
              <div style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(16px)",
                borderRadius: "20px",
                padding: "2rem",
                textAlign: "center",
              }}>
                {/* WhatsApp icon */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                  <div style={{
                    width: "48px", height: "48px",
                    borderRadius: "12px",
                    background: "#25D366",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                </div>
                <h3 style={{
                  fontFamily: "var(--font-amiri)",
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: "0.5rem",
                }}>
                  التحويل عبر واتساب
                </h3>
                <p style={{
                  fontFamily: "var(--font-tajawal)",
                  fontSize: "0.9rem",
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: "1.5rem",
                }}>
                  تواصلي معنا عبر واتساب
                </p>
                <a
                  href="https://wa.me/96897021040"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    padding: "12px 24px",
                    borderRadius: "50px",
                    background: "#25D366",
                    color: "white",
                    fontFamily: "var(--font-tajawal)",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  تواصلي عبر واتساب
                </a>
              </div>
            </div>

            {/* Urgency pill */}
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "10px 24px",
                borderRadius: "50px",
                background: "rgba(212,38,122,0.15)",
                border: "1px solid rgba(212,38,122,0.3)",
                color: "#F472B6",
                fontFamily: "var(--font-tajawal)",
                fontSize: "0.9rem",
                fontWeight: "500",
              }}>
                🔥 الأماكن محدودة — سجّلي قبل اكتمال العدد
              </span>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
