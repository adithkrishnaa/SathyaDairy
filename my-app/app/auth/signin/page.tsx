'use client'

import { useState, useEffect, useRef } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { gsap } from 'gsap'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Leaf, Droplets, Star, Heart, User, Phone, MapPin, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import logo from '../../../public/assests/logo2.png'
import heroMain from '../../../public/assests/heromain.png'

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  address: z.string().min(10, 'Address must be at least 10 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignInForm = z.infer<typeof signInSchema>
type SignUpForm = z.infer<typeof signUpSchema>

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()
  
  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null)
  const leftPanelRef = useRef<HTMLDivElement>(null)
  const rightPanelRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
  })

  // GSAP Animations
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([leftPanelRef.current, rightPanelRef.current], { 
        opacity: 0, 
        x: -50 
      });
      
      gsap.set(logoRef.current, { 
        opacity: 0, 
        y: -30 
      });

      // Entrance animation
      const tl = gsap.timeline();
      tl
        .to(leftPanelRef.current, { 
          opacity: 1, 
          x: 0, 
          duration: 1, 
          ease: "power2.out" 
        })
        .to(rightPanelRef.current, { 
          opacity: 1, 
          x: 0, 
          duration: 1, 
          ease: "power2.out" 
        }, "-=0.5")
        .to(logoRef.current, { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "power2.out" 
        }, "-=0.3");

      // Form elements animation
      if (formRef.current) {
        gsap.fromTo(formRef.current.children, 
          { 
            opacity: 0, 
            y: 20 
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.5
          }
        );
      }

      // Floating background elements
      const floatingElements = rightPanelRef.current?.querySelectorAll('.floating-element');
      floatingElements?.forEach((element, index) => {
        gsap.to(element, {
          y: -20,
          duration: 3 + (index * 0.5),
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
          delay: index * 0.3
        });
      });

    });

    return () => ctx.revert();
  }, []);

  const handleToggleMode = (mode: boolean) => {
    setIsSignUp(mode)
    reset() // Clear form when switching modes
  }

  const onSubmit = async (data: SignInForm | SignUpForm) => {
    setIsLoading(true)
    
    try {
      if (isSignUp) {
        // Handle signup
        const signUpData = data as SignUpForm
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signUpData),
        })

        const result = await response.json()

        if (response.ok) {
          toast.success('Registration successful! Please sign in.')
          setIsSignUp(false)
          reset()
        } else {
          toast.error(result.message || 'Registration failed')
        }
      } else {
        // Handle signin
        const signInData = data as SignInForm
      const result = await signIn('credentials', {
          email: signInData.email,
          password: signInData.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Invalid credentials')
      } else {
        const session = await getSession()
        if (session?.user.userType === 'CUSTOMER') {
          router.push('/dashboard/customer')
        } else if (session?.user.userType === 'OWNER') {
          router.push('/dashboard/owner')
        } else if (session?.user.userType === 'DELIVERY_PERSON') {
          router.push('/dashboard/delivery')
        }
        toast.success('Signed in successfully!')
        }
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl h-[700px] flex">
        {/* Left Panel - Form */}
        <div ref={leftPanelRef} className="flex-1 p-12 flex flex-col justify-center">
          {/* Logo and Home Button */}
          <div ref={logoRef} className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Image src={logo} alt="SathyaDairy" width={24} height={24} className="rounded" />
                </div>
                <span className="text-2xl font-bold text-gray-900">SathyaDairy</span>
              </div>
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors duration-300"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Join Our Community!' : 'Welcome Back!'}
            </h1>
            <p className="text-gray-600">
              {isSignUp 
                ? 'Create your account and start enjoying fresh, natural dairy products delivered to your doorstep.'
                : 'We are happy to see you again. Sign in to continue your journey with fresh dairy products.'
              }
          </p>
        </div>

          {/* Sign In/Sign Up Toggle */}
          <div className="mb-8">
            <div className="flex bg-gray-100 rounded-full p-1 w-fit">
              <button
                onClick={() => handleToggleMode(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  !isSignUp 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => handleToggleMode(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isSignUp 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto max-h-96">
            {/* Name Field - Only for Signup */}
            {isSignUp && (
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    {...(register as any)('name')}
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                {(errors as any).name && (
                  <p className="text-red-500 text-sm">{(errors as any).name?.message}</p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                  {...(register as any)('email')}
                type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              />
              </div>
              {(errors as any).email && (
                <p className="text-red-500 text-sm">{(errors as any).email?.message}</p>
              )}
            </div>

            {/* Phone Field - Only for Signup */}
            {isSignUp && (
              <div className="space-y-2">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    {...(register as any)('phone')}
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                {(errors as any).phone && (
                  <p className="text-red-500 text-sm">{(errors as any).phone?.message}</p>
                )}
              </div>
            )}

            {/* Address Field - Only for Signup */}
            {isSignUp && (
              <div className="space-y-2">
                <div className="relative">
                  <MapPin className="absolute left-3 top-4 text-gray-400 h-5 w-5" />
                  <textarea
                    {...(register as any)('address')}
                    placeholder="Enter your complete address"
                    rows={2}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </div>
                {(errors as any).address && (
                  <p className="text-red-500 text-sm">{(errors as any).address?.message}</p>
                )}
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                  {...(register as any)('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isSignUp ? "Create a password" : "Enter your password"}
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {(errors as any).password && (
                <p className="text-red-500 text-sm">{(errors as any).password?.message}</p>
              )}
            </div>

            {/* Confirm Password Field - Only for Signup */}
            {isSignUp && (
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    {...(register as any)('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {(errors as any).confirmPassword && (
                  <p className="text-red-500 text-sm">{(errors as any).confirmPassword?.message}</p>
                )}
              </div>
            )}

            {/* Remember Me & Forgot Password - Only for Signin */}
            {!isSignUp && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                  Forgot Password?
                </Link>
              </div>
            )}

            {/* Terms and Conditions - Only for Signup */}
            {isSignUp && (
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 mt-1"
                />
                <p className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-green-600 hover:text-green-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-green-600 hover:text-green-700">
                    Privacy Policy
                  </Link>
                </p>
          </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                {isLoading 
                  ? (isSignUp ? 'Creating Account...' : 'Signing in...') 
                  : (isSignUp ? 'Create Account' : 'Login')
                }
              </span>
              <ArrowRight className="h-5 w-5" />
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full bg-black text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-3 hover:bg-gray-800"
              >
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">🍎</span>
                </div>
                <span>{isSignUp ? 'Sign up with Apple' : 'Log in with Apple'}</span>
              </button>
              
              <button
                type="button"
                className="w-full bg-white border border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-3 hover:bg-gray-50"
              >
                <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <span>{isSignUp ? 'Sign up with Google' : 'Log in with Google'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Panel - Visual */}
        <div ref={rightPanelRef} className="flex-1 bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={heroMain}
              alt="Fresh Dairy Products"
              fill
              className="object-cover opacity-20"
            />
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0">
            <div className="floating-element absolute top-20 left-10 w-16 h-16 bg-white/20 rounded-full"></div>
            <div className="floating-element absolute top-40 right-20 w-12 h-12 bg-white/15 rounded-full"></div>
            <div className="floating-element absolute bottom-40 left-20 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="floating-element absolute bottom-20 right-10 w-14 h-14 bg-white/25 rounded-full"></div>
            
            {/* Icon Elements */}
            <div className="floating-element absolute top-1/3 left-1/4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div className="floating-element absolute top-2/3 right-1/3 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Droplets className="h-5 w-5 text-white" />
            </div>
            <div className="floating-element absolute bottom-1/3 left-1/3 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Star className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* Copyright */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-white text-sm text-center">
                © 2025 SathyaDairy. All rights reserved. Unauthorized use or reproduction of any content or materials from this website is prohibited. For more information, visit our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
