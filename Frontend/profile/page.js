"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "../../components/Header"
import { UserCircle, Camera, Lock, Eye, EyeOff, Mail, User, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [user, setUser] = useState({
    _id: "",
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    avatar: null,
    role: "",
    country: "",
    isVerified: false,
    lastLogin: "",
    createdAt: "",
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [updateSuccess, setUpdateSuccess] = useState("")
  const [updateError, setUpdateError] = useState("")

  const fileInputRef = useRef(null)
  const router = useRouter()

  // Fetch user data
  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true)
        const response = await fetch("/api/user/profile")
        const data = await response.json()

        if (data.success) {
          setUser(data.user)
          if (data.user.avatar?.url) {
            setImagePreview(data.user.avatar.url)
          }
        } else {
          setError(data.message || "Failed to fetch user data")
          // Redirect to login if not authenticated
          if (data.message === "Not authenticated") {
            router.push("/login")
          }
        }
      } catch (err) {
        setError("An error occurred while fetching user data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload to server
    try {
      setUpdateError("")
      setUpdateSuccess("")

      const formData = new FormData()
      formData.append("file", file)
      formData.append("userId", user._id)

      const response = await fetch("/api/user/upload-avatar", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        setUpdateSuccess("Avatar updated successfully")
      } else {
        setUpdateError(data.message || "Failed to update avatar")
      }
    } catch (err) {
      setUpdateError("An error occurred while uploading avatar")
      console.error(err)
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordFormData({
      ...passwordFormData,
      [name]: value,
    })
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setUpdateError("New passwords don't match!")
      return
    }

    if (passwordFormData.newPassword.length < 8) {
      setUpdateError("Password should be at least 8 characters long!")
      return
    }

    try {
      setUpdateError("")
      setUpdateSuccess("")

      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          currentPassword: passwordFormData.currentPassword,
          newPassword: passwordFormData.newPassword,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setUpdateSuccess("Password updated successfully!")
        // Reset form
        setPasswordFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        setUpdateError(data.message || "Failed to update password")
      }
    } catch (err) {
      setUpdateError("An error occurred while updating password")
      console.error(err)
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 0.8,
      },
    },
  }

  const tabVariants = {
    inactive: {
      color: "#b8b5a7",
      borderBottom: "2px solid transparent",
    },
    active: {
      color: "#e8e6d9",
      borderBottom: "2px solid #e8e6d9",
    },
  }

  // Header skeleton component
  const HeaderSkeleton = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl bg-[#172a4b] p-6 border mb-6 w-full"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="h-6 w-48 bg-gray-600 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-600 rounded animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  )

  // Profile section skeleton
  const ProfileSectionSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Avatar skeleton */}
      <div className="rounded-lg p-6 border bg-[#172a4b] flex flex-col items-center justify-center animate-pulse">
        <div className="w-32 h-32 rounded-full bg-gray-600 mb-4"></div>
        <div className="h-5 w-24 bg-gray-600 rounded mb-2"></div>
        <div className="h-4 w-32 bg-gray-600 rounded mb-4"></div>
        <div className="h-3 w-36 bg-gray-600 rounded mt-4"></div>
      </div>

      {/* Profile info skeleton */}
      <div className="rounded-lg p-6 border bg-[#172a4b] lg:col-span-2">
        <div className="flex items-center mb-4">
          <div className="w-5 h-5 rounded bg-gray-600 mr-2"></div>
          <div className="h-5 w-40 bg-gray-600 rounded"></div>
        </div>

        <div className="mb-4">
          <div className="h-4 w-20 bg-gray-600 rounded mb-2"></div>
          <div className="h-10 w-full bg-gray-600 rounded"></div>
        </div>

        <div className="mb-4">
          <div className="h-4 w-24 bg-gray-600 rounded mb-2"></div>
          <div className="h-10 w-full bg-gray-600 rounded"></div>
        </div>

        <div className="mb-6">
          <div className="h-4 w-16 bg-gray-600 rounded mb-2"></div>
          <div className="h-10 w-full bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>
  )

  // Security section skeleton
  const SecuritySectionSkeleton = () => (
    <div className="rounded-lg p-6 border bg-[#172a4b] animate-pulse">
      <div className="flex items-center mb-4">
        <div className="w-5 h-5 rounded bg-gray-600 mr-2"></div>
        <div className="h-5 w-40 bg-gray-600 rounded"></div>
      </div>

      <div className="mb-4">
        <div className="h-4 w-32 bg-gray-600 rounded mb-2"></div>
        <div className="h-10 w-full bg-gray-600 rounded"></div>
      </div>

      <div className="mb-4">
        <div className="h-4 w-28 bg-gray-600 rounded mb-2"></div>
        <div className="h-10 w-full bg-gray-600 rounded mb-1"></div>
        <div className="h-3 w-56 bg-gray-600 rounded mt-1"></div>
      </div>

      <div className="mb-6">
        <div className="h-4 w-36 bg-gray-600 rounded mb-2"></div>
        <div className="h-10 w-full bg-gray-600 rounded"></div>
      </div>

      <div className="h-10 w-40 bg-gray-600 rounded"></div>
    </div>
  )

  return (
    <main className="min-h-screen bg-[#060f20] flex w-full">
      <div className="flex-1 flex flex-col w-full">
        {/* Using the Header component */}
        <Header user={user} userImage={imagePreview} />

        <div className="flex-1 p-4 md:p-6 overflow-auto">
          {loading ? (
            <HeaderSkeleton />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl bg-[#172a4b] p-6 border mb-6 w-full"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#e8e6d9] tracking-wide">My Profile</h1>
                  <p className="text-[#b8b5a7] text-sm mt-1">Manage your account settings and profile information</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Status Messages */}
          {updateSuccess && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-100">
              {updateSuccess}
            </div>
          )}

          {(updateError || error) && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-100">
              {updateError || error}
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="flex border-b border-white mb-6">
            <motion.button
              variants={tabVariants}
              animate={activeTab === "profile" ? "active" : "inactive"}
              onClick={() => setActiveTab("profile")}
              className="px-4 py-2 mr-4 text-sm font-medium transition-all duration-200"
            >
              Profile Information
            </motion.button>
            <motion.button
              variants={tabVariants}
              animate={activeTab === "security" ? "active" : "inactive"}
              onClick={() => setActiveTab("security")}
              className="px-4 py-2 text-sm font-medium transition-all duration-200"
            >
              Security Settings
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "profile" &&
              (loading ? (
                <ProfileSectionSkeleton />
              ) : (
                <motion.div key="profile" initial="hidden" animate="visible" exit="hidden" variants={cardVariants}>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Image Section */}
                    <div className="rounded-lg p-6 border bg-[#172a4b] flex flex-col items-center justify-center">
                      <div className="relative mb-4">
                        <div className="w-32 h-32 rounded-full bg-[#060f20] flex items-center justify-center border-2 border-white overflow-hidden">
                          {imagePreview ? (
                            <img
                              src={imagePreview || "/placeholder.svg"}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserCircle size={80} className="text-[#e8e6d9]" />
                          )}
                        </div>
                        <button
                          onClick={() => fileInputRef.current.click()}
                          className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all duration-200"
                        >
                          <Camera size={18} className="text-[#060f20]" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                      <h3 className="text-[#e8e6d9] font-bold text-lg mb-1">{user.username}</h3>
                      <p className="text-[#b8b5a7] text-sm">
                        {user.firstName} <span className="text-[#b8b5a7] text-sm pl-1">{user.lastName}</span>
                      </p>
                      <p className="text-[#b8b5a7] text-xs mt-4">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                      {user.lastLogin && (
                        <p className="text-[#b8b5a7] text-xs mt-1">
                          Last login: {new Date(user.lastLogin).toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Profile Info Form - Read Only */}
                    <div className="rounded-lg p-6 border bg-[#172a4b] lg:col-span-2">
                      <h3 className="text-[#e8e6d9] font-bold text-lg mb-4 flex items-center">
                        <User size={20} className="mr-2" /> Profile Information
                      </h3>

                      <div className="mb-4">
                        <label className="block text-[#e8e6d9] text-sm font-medium mb-2">Username</label>
                        <input
                          type="text"
                          value={user.username}
                          readOnly
                          className="w-full p-3 rounded-lg border border-white text-[#e8e6d9] bg-[#172a4b]/50 cursor-not-allowed"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-[#e8e6d9] text-sm font-medium mb-2">Email Address</label>
                        <div className="flex items-center">
                          <Mail size={18} className="text-[#b8b5a7] mr-2" />
                          <input
                            type="email"
                            value={user.email}
                            readOnly
                            className="w-full p-3 rounded-lg border border-white text-[#e8e6d9] bg-[#172a4b]/50 cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-[#e8e6d9] text-sm font-medium mb-2">Country</label>
                        <div className="flex items-center">
                          <MapPin size={18} className="text-[#b8b5a7] mr-2" />
                          <input
                            type="text"
                            value={user.country || "Not specified"}
                            readOnly
                            className="w-full p-3 rounded-lg border border-white text-[#e8e6d9] bg-[#172a4b]/50 cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

            {activeTab === "security" &&
              (loading ? (
                <SecuritySectionSkeleton />
              ) : (
                <motion.div key="security" initial="hidden" animate="visible" exit="hidden" variants={cardVariants}>
                  <div className="rounded-lg p-6 border bg-[#172a4b]">
                    <h3 className="text-[#e8e6d9] font-bold text-lg mb-4 flex items-center">
                      <Lock size={20} className="mr-2" /> Change Password
                    </h3>

                    <form onSubmit={handlePasswordSubmit}>
                      <div className="mb-4">
                        <label htmlFor="currentPassword" className="block text-[#e8e6d9] text-sm font-medium mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordFormData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-3 rounded-lg border border-white text-[#e8e6d9] focus:outline-none focus:ring-2 focus:ring-[#736d58] pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#b8b5a7] hover:text-[#e8e6d9]"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-[#e8e6d9] text-sm font-medium mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            id="newPassword"
                            name="newPassword"
                            value={passwordFormData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-3 rounded-lg border border-white text-[#e8e6d9] focus:outline-none focus:ring-2 focus:ring-[#736d58] pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#b8b5a7] hover:text-[#e8e6d9]"
                          >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        <p className="text-[#b8b5a7] text-xs mt-1">Password must be at least 8 characters long</p>
                      </div>

                      <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-[#e8e6d9] text-sm font-medium mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordFormData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-3 rounded-lg border border-white text-[#e8e6d9] focus:outline-none focus:ring-2 focus:ring-[#736d58] pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#b8b5a7] hover:text-[#e8e6d9]"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="px-6 py-3 rounded-lg border border-white text-white hover:bg-[#172a4b]/20 font-medium flex items-center justify-center transition-all duration-200"
                      >
                        <Lock size={18} className="mr-2" /> Update Password
                      </motion.button>
                    </form>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>

          <div className="h-20 lg:h-0"></div>
        </div>
      </div>
    </main>
  )
}
