'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function ResetPassword() {
     const router = useRouter()
     const [password, setPassword] = useState('')
     const [confirmPassword, setConfirmPassword] = useState('')
     const [showPassword, setShowPassword] = useState(false)
     const [showConfirmPassword, setShowConfirmPassword] = useState(false)
     const [isSubmitting, setIsSubmitting] = useState(false)
     const [message, setMessage] = useState({ type: '', text: '' })
     const [activeField, setActiveField] = useState(null)
     const [token, setToken] = useState('')
     const [resetSuccess, setResetSuccess] = useState(false)
     const [windowWidth, setWindowWidth] = useState(0)
     const [windowHeight, setWindowHeight] = useState(0)
     const [deviceType, setDeviceType] = useState("desktop") // "mobile", "tablet", "desktop"
     const [isHydrated, setIsHydrated] = useState(false)
     const [email, setEmail] = useState('')

     useEffect(() => {
          // Set hydration state to true
          setIsHydrated(true)

          // Set initial window dimensions
          updateDimensions()

          // Handle window resize
          const handleResize = () => {
               updateDimensions()
          }

          // Detect device type
          detectDeviceType()

          // Get token from URL using URLSearchParams
          if (typeof window !== 'undefined') {
               const params = new URLSearchParams(window.location.search)
               const tokenParam = params.get('token')
               if (tokenParam) {
                    setToken(tokenParam)
               }

               // Get email from localStorage if available
               const savedEmail = localStorage.getItem('resetEmail')
               if (savedEmail) setEmail(savedEmail)
          }

          window.addEventListener("resize", handleResize)
          return () => window.removeEventListener("resize", handleResize)
     }, []) // Empty dependency array since we don't depend on any props or state

     const updateDimensions = () => {
          setWindowWidth(window.innerWidth)
          setWindowHeight(window.innerHeight)
     }

     const detectDeviceType = () => {
          const width = window.innerWidth
          if (width < 640) {
               setDeviceType("mobile")
          } else if (width < 1024) {
               setDeviceType("tablet")
          } else {
               setDeviceType("desktop")
          }
     }


     const handleSubmit = async (e) => {
          e.preventDefault()

          // Validate passwords match
          if (password !== confirmPassword) {
               setMessage({
                    type: 'error',
                    text: 'Passwords do not match'
               })
               return
          }

          // Validate password strength
          if (password.length < 8) {
               setMessage({
                    type: 'error',
                    text: 'Password must be at least 8 characters long'
               })
               return
          }

          setIsSubmitting(true)
          setMessage({ type: '', text: '' })

          try {
               const response = await fetch('/api/auth/reset-password', {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token, password }),
               })

               const data = await response.json()

               if (response.ok) {
                    setMessage({
                         type: 'success',
                         text: 'Password reset successfully!'
                    })
                    setResetSuccess(true)

                    // Clear stored email
                    if (typeof window !== 'undefined') {
                         localStorage.removeItem('resetEmail')
                    }

                    // Redirect to login after short delay
                    setTimeout(() => router.push('/signin'), 2000)
               } else {
                    setMessage({
                         type: 'error',
                         text: data.message || 'Failed to reset password. Please try again.'
                    })
               }
          } catch (error) {
               setMessage({
                    type: 'error',
                    text: 'An error occurred. Please try again later.'
               })
          } finally {
               setIsSubmitting(false)
          }
     }

     return (
          <div className="min-h-screen bg-[#071021] flex flex-col justify-center items-center py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8 overflow-hidden">
               {/* Header - Responsive for all screen sizes */}
               <motion.header
                    className="fixed top-0 w-full bg-[#060f20]/90 backdrop-blur-sm z-50 py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 shadow-lg"
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
               >
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                         <div className="flex items-center space-x-2">
                              <Image
                                   src="/images/Logo.png"
                                   alt="Logo"
                                   width={deviceType === "mobile" ? 32 : 40}
                                   height={deviceType === "mobile" ? 32 : 40}
                                   className="hover:scale-105 transition-transform"
                              />
                              <span
                                   className={`${deviceType === "mobile" ? "text-lg" : "text-xl"} font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500`}
                              >
                                   LA_Orbit
                              </span>
                         </div>
                    </div>
               </motion.header>

               {/* Main Content - Responsive for all screen sizes */}
               <motion.main
                    className="w-full max-w-md mx-auto pt-12 md:pt-16 lg:pt-20 relative"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
               >
                    {/* Enhanced Decorative Background Elements */}
                    <motion.div
                         className="absolute -top-16 sm:-top-20 -right-16 sm:-right-20 w-48 sm:w-56 md:w-64 h-48 sm:h-56 md:h-64 rounded-full bg-blue-600/20 filter blur-3xl"
                         initial={{ scale: 0, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         transition={{ delay: 0.2, duration: 1 }}
                    />
                    <motion.div
                         className="absolute -bottom-16 sm:-bottom-20 -left-16 sm:-left-20 w-48 sm:w-56 md:w-64 h-48 sm:h-56 md:h-64 rounded-full bg-purple-600/20 filter blur-3xl"
                         initial={{ scale: 0, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         transition={{ delay: 0.4, duration: 1 }}
                    />

                    {/* Orbital particle effect */}
                    {windowWidth > 640 && (
                         <motion.div
                              className="absolute inset-0 pointer-events-none overflow-hidden"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 1, delay: 0.6 }}
                         >
                              {/* Orbital path */}
                              <motion.div
                                   className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full border border-blue-500/10"
                                   style={{ transform: "translate(-50%, -50%)" }}
                                   initial={{ rotate: 0 }}
                                   animate={{ rotate: 360 }}
                                   transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                              />

                              {/* Floating particle on orbital path */}
                              <motion.div
                                   className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-blue-400/80"
                                   style={{ transform: "translate(-50%, -50%)" }}
                                   initial={{ rotate: 0, translateX: "32px" }}
                                   animate={{ rotate: 360 }}
                                   transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                              >
                                   <div className="absolute w-full h-full rounded-full bg-blue-400/80"
                                        style={{ boxShadow: "0 0 8px rgba(96, 165, 250, 0.8)" }}
                                   />
                              </motion.div>
                         </motion.div>
                    )}

                    <div className="relative bg-[#172a4b] border border-[#172a4b] rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl md:shadow-2xl overflow-hidden">
                         {/* Enhanced Card Header with Modern Wave Design */}
                         <div className="relative bg-blue-600 py-4 sm:py-6 md:py-8 lg:py-10 px-4 sm:px-6 md:px-8 overflow-hidden">
                              {/* Modern Wave Design */}
                              <div className="absolute inset-0 overflow-hidden">
                                   <motion.div
                                        className="absolute inset-0 bg-blue-600"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                   >
                                        {/* First Wave */}
                                        <motion.div
                                             className="absolute top-0 left-0 right-0 h-full"
                                             initial={{ opacity: 0 }}
                                             animate={{ opacity: 1 }}
                                             transition={{ duration: 0.8, delay: 0.2 }}
                                        >
                                             <svg
                                                  className="absolute top-0 right-0 h-full w-full"
                                                  viewBox="0 0 100 100"
                                                  preserveAspectRatio="none"
                                             >
                                                  <motion.path
                                                       d="M0 100 C 20 100 30 90 45 100 C 60 110 70 100 100 100 L 100 0 L 0 0 Z"
                                                       fill="#172a4b"
                                                       initial={{ opacity: 0, translateX: 100 }}
                                                       animate={{ opacity: 1, translateX: 0 }}
                                                       transition={{ duration: 1.2, ease: "easeOut" }}
                                                  />
                                             </svg>
                                        </motion.div>

                                        {/* Second Wave (Lighter Overlay) */}
                                        <motion.div
                                             className="absolute top-0 left-0 right-0 h-full"
                                             initial={{ opacity: 0 }}
                                             animate={{ opacity: 0.3 }}
                                             transition={{ duration: 0.8, delay: 0.3 }}
                                        >
                                             <svg
                                                  className="absolute top-0 right-0 h-full w-full"
                                                  viewBox="0 0 100 100"
                                                  preserveAspectRatio="none"
                                             >
                                                  <motion.path
                                                       d="M0 100 C 25 100 35 85 50 100 C 65 115 75 100 100 100 L 100 0 L 0 0 Z"
                                                       fill="#172a4b"
                                                       initial={{ opacity: 0, translateX: 100 }}
                                                       animate={{ opacity: 1, translateX: 0 }}
                                                       transition={{ duration: 1.4, ease: "easeOut" }}
                                                  />
                                             </svg>
                                        </motion.div>

                                        {/* Animated subtle lines */}
                                        <motion.div
                                             className="absolute top-0 right-0 h-full w-full"
                                             initial={{ opacity: 0 }}
                                             animate={{ opacity: 0.1 }}
                                             transition={{ duration: 0.8, delay: 0.4 }}
                                        >
                                             <svg
                                                  className="absolute top-0 right-0 h-full w-full"
                                                  viewBox="0 0 100 100"
                                                  preserveAspectRatio="none"
                                             >
                                                  {/* Subtle flowing lines */}
                                                  {[...Array(3)].map((_, i) => (
                                                       <motion.path
                                                            key={i}
                                                            d={`M${i * 20} 100 Q ${40 + i * 10} ${85 - i * 5} ${100} 100`}
                                                            stroke="rgba(255, 255, 255, 0.2)"
                                                            strokeWidth="0.5"
                                                            fill="none"
                                                            initial={{ pathLength: 0, opacity: 0 }}
                                                            animate={{ pathLength: 1, opacity: 0.7 }}
                                                            transition={{ duration: 1.5, delay: 0.3 + i * 0.2, ease: "easeInOut" }}
                                                       />
                                                  ))}
                                             </svg>
                                        </motion.div>

                                        {/* Animated particles - Client-side only rendering */}
                                        {isHydrated && [...Array(5)].map((_, i) => (
                                             <motion.div
                                                  key={i}
                                                  className="absolute w-1 h-1 rounded-full bg-white/40"
                                                  style={{
                                                       top: `${20 + Math.random() * 60}%`,
                                                       right: `${Math.random() * 60}%`,
                                                       boxShadow: "0 0 4px rgba(255, 255, 255, 0.6)"
                                                  }}
                                                  initial={{ opacity: 0, scale: 0, x: 20 }}
                                                  animate={{
                                                       opacity: [0, 0.8, 0],
                                                       scale: [0, 1, 0],
                                                       x: [20, -20],
                                                       y: [0, Math.random() * 20 - 10],
                                                  }}
                                                  transition={{
                                                       duration: 2 + Math.random() * 2,
                                                       delay: 0.5 + Math.random() * 0.5,
                                                       ease: "easeInOut",
                                                       repeat: Infinity,
                                                       repeatDelay: Math.random() * 2,
                                                  }}
                                             />
                                        ))}
                                   </motion.div>
                              </div>

                              <div className="relative z-10">
                                   <motion.h1
                                        className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 flex flex-col items-center"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                   >
                                        <motion.span
                                             className="text-sm sm:text-base md:text-lg font-normal opacity-90 mb-1"
                                             initial={{ opacity: 0, y: 10 }}
                                             animate={{ opacity: 0.9, y: 0 }}
                                             transition={{ duration: 0.5, delay: 0.2 }}
                                        >
                                             Set new password
                                        </motion.span>
                                        <motion.span
                                             className="text-xl sm:text-2xl md:text-3xl"
                                             initial={{ opacity: 0, scale: 0.8 }}
                                             animate={{ opacity: 1, scale: 1 }}
                                             transition={{ duration: 0.5, delay: 0.4 }}
                                        >
                                             Reset Your Password
                                        </motion.span>
                                   </motion.h1>
                              </div>
                         </div>

                         {/* Form Content */}
                         <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8">
                              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                                   {/* Status Message */}
                                   <AnimatePresence>
                                        {message.text && (
                                             <motion.div
                                                  className={`p-3 rounded-lg ${message.type === 'success'
                                                       ? 'bg-green-800/50 text-green-200'
                                                       : 'bg-red-800/50 text-red-200'} text-sm`}
                                                  initial={{ opacity: 0, y: -10 }}
                                                  animate={{ opacity: 1, y: 0 }}
                                                  exit={{ opacity: 0, y: -10 }}
                                                  transition={{ duration: 0.3 }}
                                             >
                                                  <div className="flex items-center">
                                                       {message.type === 'success' ? (
                                                            <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                                       ) : (
                                                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                                       )}
                                                       {message.text}
                                                  </div>
                                             </motion.div>
                                        )}
                                   </AnimatePresence>

                                   {/* Reset instructions */}
                                   {!resetSuccess && (
                                        <motion.p
                                             className="text-gray-300 text-sm"
                                             initial={{ opacity: 0 }}
                                             animate={{ opacity: 1 }}
                                             transition={{ duration: 0.5, delay: 0.1 }}
                                        >
                                             {email ? `Create a new password for ${email}` : 'Create a new secure password for your account.'}
                                        </motion.p>
                                   )}

                                   {/* Password Fields */}
                                   {!resetSuccess ? (
                                        <>
                                             {/* New Password Field */}
                                             <div className="relative">
                                                  <motion.label
                                                       htmlFor="password"
                                                       className="block text-sm font-medium mb-1 text-blue-300"
                                                       initial={{ opacity: 0, y: -10 }}
                                                       animate={{ opacity: 1, y: 0 }}
                                                       transition={{ duration: 0.3, delay: 0.1 }}
                                                  >
                                                       New Password <span className="text-blue-400">*</span>
                                                  </motion.label>
                                                  <motion.div
                                                       className={`relative flex items-center w-full bg-[#0c1629] border ${activeField === "password"
                                                            ? "border-blue-500"
                                                            : "border-[#172a4b] focus-within:border-blue-400"
                                                            } rounded-lg text-white focus-within:outline-none transition-all duration-200 focus-within:ring-1 focus-within:ring-blue-500`}
                                                       initial={{ opacity: 0, y: 20 }}
                                                       animate={{ opacity: 1, y: 0 }}
                                                       transition={{ duration: 0.4, delay: 0.2 }}
                                                  >
                                                       <input
                                                            type={showPassword ? 'text' : 'password'}
                                                            id="password"
                                                            name="password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            onFocus={() => setActiveField("password")}
                                                            onBlur={() => setActiveField(null)}
                                                            className="w-full bg-transparent p-2.5 placeholder-gray-400 focus:outline-none text-sm"
                                                            placeholder="Enter your new password"
                                                            required
                                                       />
                                                       <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="pr-3 text-gray-400 hover:text-gray-300 transition-colors"
                                                       >
                                                            {showPassword ? (
                                                                 <EyeOff size={18} />
                                                            ) : (
                                                                 <Eye size={18} />
                                                            )}
                                                       </button>
                                                  </motion.div>
                                             </div>

                                             {/* Confirm Password Field */}
                                             <div className="relative">
                                                  <motion.label
                                                       htmlFor="confirmPassword"
                                                       className="block text-sm font-medium mb-1 text-blue-300"
                                                       initial={{ opacity: 0, y: -10 }}
                                                       animate={{ opacity: 1, y: 0 }}
                                                       transition={{ duration: 0.3, delay: 0.2 }}
                                                  >
                                                       Confirm Password <span className="text-blue-400">*</span>
                                                  </motion.label>
                                                  <motion.div
                                                       className={`relative flex items-center w-full bg-[#0c1629] border ${activeField === "confirmPassword"
                                                            ? "border-blue-500"
                                                            : "border-[#172a4b] focus-within:border-blue-400"
                                                            } rounded-lg text-white focus-within:outline-none transition-all duration-200 focus-within:ring-1 focus-within:ring-blue-500`}
                                                       initial={{ opacity: 0, y: 20 }}
                                                       animate={{ opacity: 1, y: 0 }}
                                                       transition={{ duration: 0.4, delay: 0.3 }}
                                                  >
                                                       <input
                                                            type={showConfirmPassword ? 'text' : 'password'}
                                                            id="confirmPassword"
                                                            name="confirmPassword"
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            onFocus={() => setActiveField("confirmPassword")}
                                                            onBlur={() => setActiveField(null)}
                                                            className="w-full bg-transparent p-2.5 placeholder-gray-400 focus:outline-none text-sm"
                                                            placeholder="Confirm your new password"
                                                            required
                                                       />
                                                       <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="pr-3 text-gray-400 hover:text-gray-300 transition-colors"
                                                       >
                                                            {showConfirmPassword ? (
                                                                 <EyeOff size={18} />
                                                            ) : (
                                                                 <Eye size={18} />
                                                            )}
                                                       </button>
                                                  </motion.div>
                                             </div>

                                             {/* Password Requirements */}
                                             <motion.div
                                                  className="text-xs text-gray-400 space-y-1 bg-blue-900/20 p-3 rounded-lg"
                                                  initial={{ opacity: 0, y: 10 }}
                                                  animate={{ opacity: 1, y: 0 }}
                                                  transition={{ duration: 0.4, delay: 0.4 }}
                                             >
                                                  <p>Password requirements:</p>
                                                  <ul className="space-y-1">
                                                       <li className={`flex items-center ${password.length >= 8 ? "text-green-400" : ""}`}>
                                                            <div className={`w-2 h-2 rounded-full mr-2 ${password.length >= 8 ? "bg-green-400" : "bg-gray-500"}`}></div>
                                                            At least 8 characters
                                                       </li>
                                                       <li className={`flex items-center ${/[A-Z]/.test(password) ? "text-green-400" : ""}`}>
                                                            <div className={`w-2 h-2 rounded-full mr-2 ${/[A-Z]/.test(password) ? "bg-green-400" : "bg-gray-500"}`}></div>
                                                            At least one uppercase letter
                                                       </li>
                                                       <li className={`flex items-center ${/[0-9]/.test(password) ? "text-green-400" : ""}`}>
                                                            <div className={`w-2 h-2 rounded-full mr-2 ${/[0-9]/.test(password) ? "bg-green-400" : "bg-gray-500"}`}></div>
                                                            At least one number
                                                       </li>
                                                  </ul>
                                             </motion.div>
                                        </>
                                   ) : (
                                        <motion.div
                                             className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30"
                                             initial={{ opacity: 0, y: 20 }}
                                             animate={{ opacity: 1, y: 0 }}
                                             transition={{ duration: 0.4, delay: 0.2 }}
                                        >
                                             <div className="flex flex-col items-center justify-center py-2">
                                                  <CheckCircle size={40} className="text-green-400 mb-2" />
                                                  <p className="text-blue-200 text-sm font-medium">
                                                       Password reset successfully!
                                                  </p>
                                                  <p className="text-blue-300/80 text-xs mt-2 text-center">
                                                       Your password has been updated. You will be redirected to login...
                                                  </p>
                                             </div>
                                        </motion.div>
                                   )}

                                   {/* Submit Button or Back to Login Button */}
                                   {!resetSuccess ? (
                                        <motion.button
                                             type="submit"
                                             disabled={isSubmitting}
                                             className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center mt-6 transition-all duration-200 relative overflow-hidden disabled:opacity-70 disabled:hover:bg-blue-600"
                                             initial={{ opacity: 0, y: 20 }}
                                             animate={{ opacity: 1, y: 0 }}
                                             transition={{ duration: 0.5, delay: 0.5 }}
                                             whileHover={{ scale: 1.02 }}
                                             whileTap={{ scale: 0.98 }}
                                        >
                                             {isSubmitting ? (
                                                  <span className="flex items-center justify-center">
                                                       <svg
                                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                       >
                                                            <circle
                                                                 className="opacity-25"
                                                                 cx="12"
                                                                 cy="12"
                                                                 r="10"
                                                                 stroke="currentColor"
                                                                 strokeWidth="4"
                                                            ></circle>
                                                            <path
                                                                 className="opacity-75"
                                                                 fill="currentColor"
                                                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            ></path>
                                                       </svg>
                                                       Resetting Password...
                                                  </span>
                                             ) : (
                                                  "Reset Password"
                                             )}
                                             {/* Button background pulse effect */}
                                             <motion.div
                                                  className="absolute inset-0 bg-blue-500 rounded-lg"
                                                  initial={{ scale: 0, opacity: 0 }}
                                                  animate={{
                                                       scale: [0, 1.5, 1.5],
                                                       opacity: [0.7, 0, 0],
                                                  }}
                                                  transition={{
                                                       duration: 1.5,
                                                       repeat: Infinity,
                                                       repeatDelay: 2,
                                                  }}
                                             />
                                        </motion.button>
                                   ) : (
                                        <motion.button
                                             type="button"
                                             onClick={() => router.push('/signin')}
                                             className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center mt-6 transition-all duration-200 relative overflow-hidden"
                                             initial={{ opacity: 0, y: 20 }}
                                             animate={{ opacity: 1, y: 0 }}
                                             transition={{ duration: 0.5, delay: 0.5 }}
                                             whileHover={{ scale: 1.02 }}
                                             whileTap={{ scale: 0.98 }}
                                        >
                                             Go to Login
                                        </motion.button>
                                   )}

                                   {/* Back to Login Link */}
                                   {!resetSuccess && (
                                        <motion.div
                                             className="text-center mt-4 text-sm text-gray-400"
                                             initial={{ opacity: 0 }}
                                             animate={{ opacity: 1 }}
                                             transition={{ duration: 0.5, delay: 0.6 }}
                                        >
                                             <Link
                                                  href="/signin"
                                                  className="text-blue-400 hover:underline font-medium flex items-center justify-center"
                                             >
                                                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
                                             </Link>
                                        </motion.div>
                                   )}
                              </div>
                         </form>
                    </div>
               </motion.main>

               {/* Footer */}
               <motion.footer
                    className="text-center text-xs text-gray-500 py-6 mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
               >
                    <p>&copy; {new Date().getFullYear()} LA_Orbit. All rights reserved.</p>
               </motion.footer>
          </div>
     )
}