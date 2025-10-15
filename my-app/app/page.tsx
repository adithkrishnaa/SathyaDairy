"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Star, 
  ArrowRight, 
  Check, 
  Leaf, 
  Zap, 
  Shield, 
  Droplets,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  User,
  LogOut,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import logo from "../public/assests/logo2.png";
import heroMain from "../public/assests/heromain.png";
import heroMain2 from "../public/assests/heromain2.png";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  owner: {
    name: string;
  };
}

export default function Home() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Refs for GSAP animations
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const valuePropsRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const naturalAdvantageRef = useRef<HTMLDivElement>(null);
  const sustainabilityRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const newsletterRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const getDashboardUrl = () => {
    if (!session?.user?.userType) return "/auth/signin";
    
    switch (session.user.userType) {
      case "CUSTOMER":
        return "/dashboard/customer";
      case "OWNER":
        return "/dashboard/owner";
      case "DELIVERY_PERSON":
        return "/dashboard/delivery";
      case "ADMIN":
        return "/dashboard/admin";
      default:
        return "/auth/signin";
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([heroContentRef.current, heroImageRef.current], {
        opacity: 0,
        y: 50,
      });

      gsap.set(navRef.current, {
        opacity: 0,
        y: -20,
      });

      // Hero section entrance animation
      const heroTl = gsap.timeline();
      heroTl
        .to(navRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        })
        .to(
          heroContentRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .to(
          heroImageRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.6"
        );

      // Add text animation to hero title
      if (heroContentRef.current) {
        const title = heroContentRef.current.querySelector("h1");
        if (title) {
          gsap.fromTo(
            title.children,
            {
              opacity: 0,
              y: 30,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.2,
              ease: "power2.out",
              delay: 0.5,
            }
          );
        }
      }

      // Value propositions animation
      if (valuePropsRef.current) {
        gsap.fromTo(
          valuePropsRef.current.children,
          {
            opacity: 0,
            y: 60,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: valuePropsRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Products section animation
      if (productsRef.current) {
        gsap.fromTo(
          productsRef.current.querySelectorAll(".product-card"),
          {
            opacity: 0,
            y: 80,
            rotationY: 15,
          },
          {
            opacity: 1,
            y: 0,
            rotationY: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: productsRef.current,
              start: "top 70%",
              end: "bottom 30%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Natural advantage section animation
      if (naturalAdvantageRef.current) {
        gsap.fromTo(
          naturalAdvantageRef.current.querySelectorAll(".advantage-card"),
          {
            opacity: 0,
            y: 50,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: naturalAdvantageRef.current,
              start: "top 75%",
              end: "bottom 25%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Sustainability section animation
      if (sustainabilityRef.current) {
        gsap.fromTo(
          sustainabilityRef.current.querySelector(".sustainability-content"),
          {
            opacity: 0,
            x: -100,
          },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sustainabilityRef.current,
              start: "top 70%",
              end: "bottom 30%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          sustainabilityRef.current.querySelector(".sustainability-image"),
          {
            opacity: 0,
            x: 100,
            rotation: 5,
          },
          {
            opacity: 1,
            x: 0,
            rotation: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sustainabilityRef.current,
              start: "top 70%",
              end: "bottom 30%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Testimonials animation
      if (testimonialsRef.current) {
        gsap.fromTo(
          testimonialsRef.current.querySelectorAll(".testimonial-card"),
          {
            opacity: 0,
            y: 60,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: testimonialsRef.current,
              start: "top 75%",
              end: "bottom 25%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Newsletter section animation
      if (newsletterRef.current) {
        gsap.fromTo(
          newsletterRef.current,
          {
            opacity: 0,
            scale: 0.95,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: newsletterRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Footer animation
      if (footerRef.current) {
        gsap.fromTo(
          footerRef.current,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Enhanced smooth scroll for navigation links
      const navLinks = document.querySelectorAll('a[href^="#"]');
      navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const targetId = link.getAttribute("href")?.substring(1);
          const targetElement = document.getElementById(targetId || "");

          if (targetElement) {
            // Add a subtle scale animation to the clicked link
            gsap.to(link, {
              scale: 0.95,
              duration: 0.1,
              yoyo: true,
              repeat: 1,
              ease: "power2.out"
            });

            // Smooth scroll with enhanced easing
            gsap.to(window, {
              duration: 1.8,
              scrollTo: { y: targetElement, offsetY: 80 },
              ease: "power3.inOut",
            });

            // Add a subtle highlight effect to the target section
            gsap.fromTo(targetElement, 
              { 
                boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.4)" 
              },
              {
                boxShadow: "0 0 0 10px rgba(34, 197, 94, 0.1)",
                duration: 0.5,
                ease: "power2.out",
                yoyo: true,
                repeat: 1
              }
            );
          }
        });
      });

      // Add parallax scrolling effect to hero background
      const heroBackground = heroRef.current?.querySelector('.absolute.inset-0');
      if (heroBackground) {
        gsap.to(heroBackground, {
          yPercent: -50,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }

      // Add scroll-triggered animations for navigation
      ScrollTrigger.create({
        trigger: "body",
        start: "top -100",
        end: "bottom bottom",
        onEnter: () => {
          gsap.to(navRef.current, {
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            duration: 0.3,
            ease: "power2.out"
          });
        },
        onLeaveBack: () => {
          gsap.to(navRef.current, {
            backgroundColor: "rgba(255, 255, 255, 1)",
            backdropFilter: "blur(0px)",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });

      // Scroll progress indicator
      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const progress = self.progress * 100;
          const progressBar = document.getElementById('scroll-progress');
          if (progressBar) {
            progressBar.style.width = `${progress}%`;
          }
        }
      });

      // Add hover animations for buttons and interactive elements
      const buttons = document.querySelectorAll(
        "button, .bg-green-600, .border-2"
      );
      buttons.forEach((button) => {
        button.addEventListener("mouseenter", () => {
          gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        button.addEventListener("mouseleave", () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      // Add hover animations for product cards
      const productCards = document.querySelectorAll(".product-card");
      productCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -10,
            scale: 1.02,
            duration: 0.4,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        });
      });

      // Add hover animations for advantage cards
      const advantageCards = document.querySelectorAll(".advantage-card");
      advantageCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -5,
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      // Add hover animations for testimonial cards
      const testimonialCards = document.querySelectorAll(".testimonial-card");
      testimonialCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -8,
            scale: 1.03,
            duration: 0.4,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        });
      });

      // Add floating animation to hero image elements
      if (heroImageRef.current) {
        gsap.to(
          heroImageRef.current.querySelector(".absolute.-bottom-4.-right-4"),
          {
            y: -10,
            duration: 2,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1,
          }
        );

        gsap.to(heroImageRef.current.querySelector(".absolute.top-8.-left-8"), {
          y: 10,
          duration: 2.5,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
        });

        // Animate the floating icons
        gsap.to(
          heroImageRef.current.querySelector(".absolute.top-1\\/2.-right-6"),
          {
            y: -15,
            rotation: 5,
            duration: 3,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1,
          }
        );

        gsap.to(
          heroImageRef.current.querySelector(".absolute.bottom-1\\/3.-left-6"),
          {
            y: 12,
            rotation: -3,
            duration: 2.8,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1,
          }
        );
      }

      // Add bouncing animations to background elements
      if (heroRef.current) {
        const bouncingElements =
          heroRef.current.querySelectorAll(".animate-bounce");
        bouncingElements.forEach((element, index) => {
          gsap.to(element, {
            y: -20,
            duration: 2 + index * 0.3,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1,
            delay: index * 0.2,
          });
        });

        // Add rotation to some elements
        const rotatingElements = heroRef.current.querySelectorAll(
          ".bg-green-300, .bg-blue-300, .bg-yellow-300, .bg-pink-300"
        );
        rotatingElements.forEach((element, index) => {
          gsap.to(element, {
            rotation: 360,
            duration: 8 + index * 2,
            ease: "none",
            repeat: -1,
          });
        });
      }
    });

    return () => ctx.revert();
  }, [loading]);

  return (
    <div className="min-h-screen bg-white">
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300 ease-out"
          style={{ width: "0%" }}
          id="scroll-progress"></div>
      </div>
      {/* Navigation */}
      <nav ref={navRef} className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Image src={logo} alt="logo" width={200} height={200} />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a
                  href="#home"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">
                  Home
                </a>
                <a
                  href="#products"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">
                  Products
                </a>
                <a
                  href="#about"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">
                  About Us
                </a>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">
                  Contact
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Search className="h-5 w-5 text-gray-600 cursor-pointer hover:text-green-600" />
              {/* <ShoppingCart className="h-5 w-5 text-gray-600 cursor-pointer hover:text-green-600" /> */}
              <div className="bg-pink-100 text-pink-600 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-200">
                <Heart className="h-4 w-4" />
              </div>

              {session ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href={getDashboardUrl()}
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium">
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  {/* <Link
             href="/auth/otp-login"
             className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
           >
             OTP Login
           </Link> */}
                  <Link
                    href="/auth/signin"
                    className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                    Login
                  </Link>
                  <Link
                    href="/auth/otp-register"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        id="home"
        className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-r from-green-50 to-[#DCFCE7]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 ">
          {/* Floating Bouncing Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-30 animate-gentle-bounce"></div>
          <div
            className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-25 animate-float-up"
            style={{ animationDelay: "0.5s" }}></div>
          <div
            className="absolute bottom-40 left-20 w-12 h-12 bg-yellow-200 rounded-full opacity-30 animate-float-down"
            style={{ animationDelay: "1s" }}></div>
          <div
            className="absolute top-60 left-1/3 w-14 h-14 bg-pink-200 rounded-full opacity-25 animate-gentle-bounce"
            style={{ animationDelay: "1.5s" }}></div>
          <div
            className="absolute bottom-60 right-1/3 w-18 h-18 bg-purple-200 rounded-full opacity-20 animate-pulse-glow"
            style={{ animationDelay: "2s" }}></div>

          {/* Additional Floating Shapes */}
          <div
            className="absolute top-32 right-1/4 w-8 h-8 bg-green-300 rounded-lg opacity-20 animate-slow-rotate"
            style={{ animationDelay: "0.8s" }}></div>
          <div
            className="absolute bottom-32 left-1/4 w-10 h-10 bg-blue-300 rounded-lg opacity-25 animate-float-up"
            style={{ animationDelay: "1.3s" }}></div>
          <div
            className="absolute top-1/2 left-10 w-6 h-6 bg-yellow-300 rounded-full opacity-30 animate-float-down"
            style={{ animationDelay: "1.8s" }}></div>
          <div
            className="absolute top-1/3 right-10 w-7 h-7 bg-pink-300 rounded-lg opacity-20 animate-gentle-bounce"
            style={{ animationDelay: "2.3s" }}></div>

          {/* Additional Decorative Elements */}
          <div
            className="absolute top-1/4 left-1/2 w-4 h-4 bg-green-400 rounded-full opacity-40 animate-pulse-glow"
            style={{ animationDelay: "0.3s" }}></div>
          <div
            className="absolute bottom-1/4 right-1/2 w-5 h-5 bg-blue-400 rounded-full opacity-35 animate-float-up"
            style={{ animationDelay: "1.7s" }}></div>
          <div
            className="absolute top-3/4 left-1/4 w-3 h-3 bg-yellow-400 rounded-full opacity-45 animate-float-down"
            style={{ animationDelay: "2.1s" }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
          <div ref={heroContentRef} className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Pure, Fresh <span className="text-green-600">Dairy Products</span>
              <br />
              From Nature to Your Table
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Experience the goodness of farm-fresh milk and natural products
              sourced directly from local farms. Pure, nutritious, and
              sustainably produced.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {session ? (
                <Link
                  href={getDashboardUrl()}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-medium inline-flex items-center justify-center">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <Link
                  href="/auth/otp-register"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2  text-lg font-medium inline-flex items-center justify-center rounded-full hover:drop-shadow-emerald-800">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              )}
              <Link
                href="#about"
                className="border-2 border-green-200 text-green-600 hover:bg-green-50 px-4 py-2 rounded-full text-lg font-medium drop-shadow-2xl">
                Learn More
              </Link>
            </div>
          </div>
          <div ref={heroImageRef} className="relative">
            <div className="relative z-10 flex justify-center align-middle">
              <div className="bg-white rounded-3xl p-6 shadow-2xl size-96 flex justify-center align-middle">
                <div className="relative flex justify-center align-middle">
                  <Image
                    src={heroMain}
                    alt="Fresh Dairy Products"
                    width={500}
                    height={300}
                    className="rounded-2xl object-cover w-full h-auto"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-lg animate-pulse-glow">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  100% Organic
                </span>
              </div>
            </div>

            {/* Floating Product Showcase */}
            <div className="absolute top-8 -left-8 w-24 h-24 bg-white rounded-xl shadow-lg p-2 animate-float-up">
              <Image
                src={heroMain2}
                alt="Premium Dairy"
                width={80}
                height={80}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>

            {/* Additional Floating Elements */}
            <div
              className="absolute top-1/2 -right-6 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center shadow-lg animate-gentle-bounce"
              style={{ animationDelay: "1s" }}>
              <Leaf className="h-8 w-8 text-green-600" />
            </div>

            <div
              className="absolute bottom-1/3 -left-6 w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center shadow-lg animate-float-down"
              style={{ animationDelay: "1.5s" }}>
              <Droplets className="h-6 w-6 text-blue-600" />
            </div>

            {/* Additional Floating Icons */}
            <div
              className="absolute top-1/4 -right-12 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center shadow-lg animate-slow-rotate"
              style={{ animationDelay: "2s" }}>
              <Star className="h-6 w-6 text-yellow-600" />
            </div>

            <div
              className="absolute bottom-1/4 -left-12 w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center shadow-lg animate-pulse-glow"
              style={{ animationDelay: "2.5s" }}>
              <Heart className="h-5 w-5 text-pink-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section ref={valuePropsRef} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quality Guaranteed
              </h3>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ethically Sourced
              </h3>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Fast Delivery
              </h3>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Customer Satisfaction
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Products Section */}
      <section ref={productsRef} id="products" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Our Products
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Premium Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our entire range of premium dairy and natural products,
              sourced from local farms and made with care and integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {loading ? (
              // Loading skeleton
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="p-6">
                    <div className="bg-gray-300 rounded-xl h-48 mb-6"></div>
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-6"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-gray-300 rounded w-24"></div>
                      <div className="h-10 w-10 bg-gray-300 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : products.length > 0 ? (
              products.slice(0, 6).map((product) => (
                <div
                  key={product.id}
                  className="product-card bg-white rounded-2xl shadow-lg overflow-hidden relative">
                  <div className="absolute top-4 right-4 bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                    {product.category}
                  </div>
                  <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Heart className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="p-6">
                    <div className="bg-gray-800 rounded-xl h-48 mb-6 flex items-center justify-center">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <div className="bg-white rounded-lg p-4">
                          <div className="w-12 h-24 bg-gradient-to-b from-white to-gray-100 rounded-lg mb-2"></div>
                          <div className="w-8 h-16 bg-white rounded-lg"></div>
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">4.5</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{product.price}
                      </span>
                      {session ? (
                        <Link
                          href={getDashboardUrl()}
                          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg">
                          <ShoppingCart className="h-5 w-5" />
                        </Link>
                      ) : (
                        <Link
                          href="/auth/signup"
                          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg">
                          <ShoppingCart className="h-5 w-5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  No products available at the moment.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Check back later for fresh dairy products!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Natural Advantage Section */}
      <section ref={naturalAdvantageRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Why Choose Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Natural Advantage
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;re committed to providing the highest quality natural
              products while maintaining our farming traditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="advantage-card bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                100% Organic
              </h3>
              <p className="text-sm text-gray-600">
                Pure, natural ingredients without harmful chemicals
              </p>
            </div>

            <div className="advantage-card bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplets className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Fresh Daily
              </h3>
              <p className="text-sm text-gray-600">
                Delivered fresh from farm to your table every day
              </p>
            </div>

            <div className="advantage-card bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nutritious & Healthy
              </h3>
              <p className="text-sm text-gray-600">
                Rich in essential nutrients for your family&apos;s health
              </p>
            </div>

            <div className="advantage-card bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quality Guaranteed
              </h3>
              <p className="text-sm text-gray-600">
                Rigorous quality checks ensure the best products
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section ref={sustainabilityRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Our Values
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Commitment to Sustainability
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We work closely with local farmers to ensure sustainable farming
              practices. By choosing our products, you&apos;re supporting
              community-friendly initiatives and helping rural economies thrive.
            </p>
          </div>

          <div className="relative bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-12">
              <div className="sustainability-content text-white">
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <Check className="h-6 w-6 text-green-300 mr-3" />
                    <span className="text-lg">
                      Ethically sourced ingredients
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-6 w-6 text-green-300 mr-3" />
                    <span className="text-lg">Eco-friendly packaging</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-6 w-6 text-green-300 mr-3" />
                    <span className="text-lg">Carbon-neutral delivery</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-6 w-6 text-green-300 mr-3" />
                    <span className="text-lg">Sustainable farming methods</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-6 w-6 text-green-300 mr-3" />
                    <span className="text-lg">Improved animal welfare</span>
                  </li>
                </ul>
              </div>
              <div className="sustainability-image relative">
                <div className="bg-gray-800 rounded-2xl h-80 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-32 h-32 bg-green-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Leaf className="h-16 w-16 text-green-600" />
                    </div>
                    <p className="text-lg font-medium">Sustainable Farming</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white rounded-xl shadow-lg p-4">
                  <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don&apos;t just take our word for it. Hear what our happy
              customers have to say about our products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="testimonial-card bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Sarah Johnson
              </h4>
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <div className="text-4xl text-gray-300 mb-4"></div>
              <p className="text-gray-600 mb-4">
                &apos;The quality of milk is exceptional and the delivery
                service is always on time. My family loves the fresh taste every
                morning.&apos;
              </p>
              <div className="flex items-center justify-center">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm text-green-600 font-medium">
                  Verified Customer
                </span>
              </div>
            </div>

            <div className="testimonial-card bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Michael Brown
              </h4>
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <div className="text-4xl text-gray-300 mb-4"></div>
              <p className="text-gray-600 mb-4">
                &apos;SathyaDairy has transformed how we get our dairy products.
                The organic cheese is absolutely delicious and worth every
                penny.&apos;
              </p>
              <div className="flex items-center justify-center">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm text-green-600 font-medium">
                  Verified Customer
                </span>
              </div>
            </div>

            <div className="testimonial-card bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Emily Rodriguez
              </h4>
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <div className="text-4xl text-gray-300 mb-4">&apos;</div>
              <p className="text-gray-600 mb-4">
                &apos;I love supporting sustainable farming practices. The milk
                is fresh, pure, and knowing it&apos;s ethically sourced makes it
                even better.&apos;
              </p>
              <div className="flex items-center justify-center">
                <Check className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm text-green-600 font-medium">
                  Verified Customer
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section
        ref={newsletterRef}
        className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join Our Community of Satisfied Customers
          </h2>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            Subscribe to our newsletter and receive exclusive deals, early
            access to new products, and a special 20% discount on your first
            order!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-lg text-lg font-medium">
              Subscribe Now
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-lg text-lg font-medium">
              Learn More
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center text-white">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-300 mr-2" />
              <span>Exclusive discounts</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-300 mr-2" />
              <span>Early access to new products</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-300 mr-2" />
              <span>Fresh recipes & tips</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer ref={footerRef} className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <span className="text-2xl font-bold text-green-400">
                  SathyaDairy
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Providing fresh, natural dairy products from our farm to your
                table since 2015.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="text-gray-400 hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#products"
                    className="text-gray-400 hover:text-white">
                    Products
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#sustainability"
                    className="text-gray-400 hover:text-white">
                    Sustainability
                  </a>
                </li>
                <li>
                  <a href="#blog" className="text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Farmhouse
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  (01) 123-456-7890
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  hello@sathya.com
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Subscribe to receive amazing, exclusive newsletter deals and
                more.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                />
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-r-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              &copy; 2023 SathyaDairy. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#privacy" className="text-gray-400 hover:text-white">
                Privacy Policy
              </a>
              <a href="#terms" className="text-gray-400 hover:text-white">
                Terms of Service
              </a>
              <a href="#shipping" className="text-gray-400 hover:text-white">
                Shipping Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
