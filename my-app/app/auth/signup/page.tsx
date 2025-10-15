'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { gsap } from 'gsap'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Leaf, Droplets, Star, Heart, Phone, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import logo from '../../../public/assests/logo2.png'
import heroMain from '../../../public/assests/heromain.png'

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

type SignUpForm = z.infer<typeof signUpSchema>

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSignIn, setIsSignIn] = useState(false)
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
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
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

  const onSubmit = async (data: SignUpForm) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Registration successful! Please sign in.')
        router.push('/auth/signin')
      } else {
        toast.error(result.message || 'Registration failed')
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
        <div ref={leftPanelRef} className="flex-1 p-12 flex flex-col justify-center overflow-y-auto">
          {/* Logo */}
          <div ref={logoRef} className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Image src={logo} alt="SathyaDairy" width={24} height={24} className="rounded" />
              </div>
              <span className="text-2xl font-bold text-gray-900">SathyaDairy</span>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join Our Community!
            </h1>
            <p className="text-gray-600">
              Create your account and start enjoying fresh, natural dairy products delivered to your doorstep.
            </p>
          </div>

          {/* Sign In/Sign Up Toggle */}
          <div className="mb-8">
            <div className="flex bg-gray-100 rounded-full p-1 w-fit">
              <button
                onClick={() => setIsSignIn(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isSignIn 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignIn(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  !isSignIn 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            {/* Address Field */}
            <div className="space-y-2">
              <div className="relative">
                <MapPin className="absolute left-3 top-4 text-gray-400 h-5 w-5" />
                <textarea
                  {...register('address')}
                  placeholder="Enter your complete address"
                  rows={2}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
                />
              </div>
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
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
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  {...register('confirmPassword')}
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
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms and Conditions */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
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
                <span>Sign up with Apple</span>
              </button>
              
              <button
                type="button"
                className="w-full bg-white border border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-3 hover:bg-gray-50"
              >
                <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <span>Sign up with Google</span>
              </button>
            </div>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-green-600 hover:text-green-700 font-medium">
                  Sign in here
                </Link>
              </p>
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
            <div className="floating-element absolute top-1/2 right-1/4 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="h-3 w-3 text-white" />
            </div>
          </div>

          {/* Copyright */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-white text-sm text-center">
                © 2025 SathyaDairy. All rights reserved. Join thousands of satisfied customers enjoying fresh, natural dairy products delivered daily.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}