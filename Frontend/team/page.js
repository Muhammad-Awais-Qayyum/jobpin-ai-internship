"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { UserCircle, Copy, Mail, Users, ChevronLeft, ChevronRight } from "lucide-react"
import Header from "../../components/Header"
import toast from "react-hot-toast"

export default function Team() {
  const [user, setUser] = useState({
    _id: "",
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    avatar: null,
    referralCode: "",
    referralStats: {
      totalReferrals: 0,
      activeReferrals: 0,
      totalEarnings: 0,
    },
    referredUsers: [],
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [imagePreview, setImagePreview] = useState(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [paginatedReferrals, setPaginatedReferrals] = useState([])

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
          // Calculate total pages based on referredUsers length
          const totalPagesCount = Math.ceil((data.user.referredUsers?.length || 0) / itemsPerPage)
          setTotalPages(totalPagesCount || 1)
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
  }, [])

  // Update paginated referrals when page changes or user data changes
  useEffect(() => {
    if (user.referredUsers && user.referredUsers.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = Math.min(startIndex + itemsPerPage, user.referredUsers.length)
      setPaginatedReferrals(user.referredUsers.slice(startIndex, endIndex))
    } else {
      setPaginatedReferrals([])
    }
  }, [currentPage, itemsPerPage, user.referredUsers])

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = Number.parseInt(e.target.value)
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page
    setTotalPages(Math.ceil((user.referredUsers?.length || 0) / newItemsPerPage) || 1)
  }

  const referralLink = `${process.env.NEXT_PUBLIC_APP_URL}/ref/${user.referralCode}`

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        toast.success("Referral link copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  const statsCards = [
    {
      title: "Total Referrals",
      value: user.referralStats?.totalReferrals || 0,
      icon: <Users size={20} className="text-[#e8e6d9]" />,
    },
    {
      title: "Active Referrals",
      value: user.referralStats?.activeReferrals || 0,
      icon: <UserCircle size={20} className="text-[#e8e6d9]" />,
    },
    {
      title: "Total Earnings",
      value: `USD ${user.referralStats?.totalEarnings?.toFixed(2) || "0.00"}`,
      icon: <Mail size={20} className="text-[#e8e6d9]" />,
    },
  ]

  // Generate pagination buttons
  const renderPagination = () => {
    const pages = []

    // Always show first page
    pages.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        className={`w-8 h-8 rounded-md flex items-center justify-center text-sm ${
          currentPage === 1
            ? "bg-[#e8e6d9] text-[#060f20] font-bold"
            : "text-[#e8e6d9] hover:bg-[#172a4b] border border-[#e8e6d9]/20"
        }`}
      >
        1
      </button>,
    )

    // Calculate range of pages to show
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    // Show ellipsis after first page if needed
    if (startPage > 2) {
      pages.push(
        <span key="ellipsis1" className="text-[#e8e6d9] px-1">
          ...
        </span>,
      )
    }

    // Show middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-8 h-8 rounded-md flex items-center justify-center text-sm ${
            currentPage === i
              ? "bg-[#e8e6d9] text-[#060f20] font-bold"
              : "text-[#e8e6d9] hover:bg-[#172a4b] border border-[#e8e6d9]/20"
          }`}
        >
          {i}
        </button>,
      )
    }

    // Show ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push(
        <span key="ellipsis2" className="text-[#e8e6d9] px-1">
          ...
        </span>,
      )
    }

    // Always show last page if it's not the first page
    if (totalPages > 1) {
      pages.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          className={`w-8 h-8 rounded-md flex items-center justify-center text-sm ${
            currentPage === totalPages
              ? "bg-[#e8e6d9] text-[#060f20] font-bold"
              : "text-[#e8e6d9] hover:bg-[#172a4b] border border-[#e8e6d9]/20"
          }`}
        >
          {totalPages}
        </button>,
      )
    }

    return pages
  }

  // Header skeleton component
  const HeaderSkeleton = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl bg-[#172a4b] p-4 md:p-6 border mb-6 w-full"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="h-6 w-48 bg-gray-600 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-600 rounded animate-pulse"></div>
        </div>
        <div className="p-3 rounded-lg border border-white animate-pulse">
          <div className="h-6 w-48 bg-gray-600 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-600 rounded"></div>
        </div>
      </div>
    </motion.div>
  )

  // Stats cards skeleton
  const StatsCardsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-6">
      {[0, 1, 2].map((index) => (
        <div key={index} className="rounded-lg p-4 border bg-[#172a4b] animate-pulse">
          <div className="flex items-center mb-3">
            <div className="w-9 h-9 rounded-full bg-gray-600 mr-3"></div>
            <div className="h-4 w-28 bg-gray-600 rounded"></div>
          </div>
          <div className="h-6 w-24 bg-gray-600 rounded ml-2"></div>
        </div>
      ))}
    </div>
  )

  // Table skeleton
  const TableSkeleton = () => (
    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#e8e6d9]/20 scrollbar-track-transparent">
      <table className="w-full min-w-[650px]">
        <thead>
          <tr className="border-b border-white/20">
            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-[#b8b5a7]">Username</th>
            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-[#b8b5a7]">Email</th>
            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-[#b8b5a7]">Join Date</th>
            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-[#b8b5a7]">Status</th>
            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-[#b8b5a7]">Investment</th>
            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-[#b8b5a7]">Commission</th>
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2, 3, 4].map((index) => (
            <tr key={index} className="border-b border-white/10">
              <td className="px-2 sm:px-4 py-3">
                <div className="h-4 w-24 bg-gray-600 rounded animate-pulse"></div>
              </td>
              <td className="px-2 sm:px-4 py-3">
                <div className="h-4 w-32 bg-gray-600 rounded animate-pulse"></div>
              </td>
              <td className="px-2 sm:px-4 py-3">
                <div className="h-4 w-28 bg-gray-600 rounded animate-pulse"></div>
              </td>
              <td className="px-2 sm:px-4 py-3">
                <div className="h-6 w-16 bg-gray-600 rounded-full animate-pulse"></div>
              </td>
              <td className="px-2 sm:px-4 py-3">
                <div className="h-4 w-20 bg-gray-600 rounded animate-pulse"></div>
              </td>
              <td className="px-2 sm:px-4 py-3">
                <div className="h-4 w-20 bg-gray-600 rounded animate-pulse"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <main className="min-h-screen bg-[#060f20] flex w-full">
      <div className="flex-1 flex flex-col w-full">
        <Header user={user} userImage={imagePreview} />

        <div className="flex-1 p-4 md:p-6 overflow-auto">
          {loading ? (
            <HeaderSkeleton />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl bg-[#172a4b] p-4 md:p-6 border mb-6 w-full"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="text-xl sm:text-2xl font-bold text-[#e8e6d9] tracking-wide"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="block sm:inline">My Team</span>
                    </div>
                  </motion.h1>
                  <p className="text-[#b8b5a7] mt-2">Manage your referrals and track earnings</p>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="p-3 rounded-lg border border-white"
                >
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[#e8e6d9] font-bold text-sm sm:text-base">Referral Link:</span>
                      <button
                        onClick={copyToClipboard}
                        className="text-[#e8e6d9] hover:text-[#b8b5a7] transition-all duration-200"
                        title="Copy to clipboard"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                    <span className="text-[#e8e6d9] text-xs sm:text-sm break-all max-w-[250px] md:max-w-[350px] lg:max-w-full overflow-hidden text-ellipsis">
                      {referralLink}
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-100">{error}</div>}

          {loading ? (
            <StatsCardsSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-6">
              {statsCards.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.01, y: -5 }}
                  className="rounded-lg p-4 border bg-[#172a4b]"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-9 h-9 rounded-full bg-[#172a4b] text-white flex items-center justify-center mr-3 border border-white">
                      {stat.icon}
                    </div>
                    <p className="text-[#e8e6d9] font-bold text-sm sm:text-base">{stat.title}</p>
                  </div>
                  <p className="font-bold text-lg text-[#e8e6d9] pl-2">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="rounded-xl bg-[#172a4b] p-4 md:p-6 border w-full"
          >
            <h2 className="text-xl font-bold text-[#e8e6d9] mb-4">My Referrals</h2>

            {loading ? (
              <TableSkeleton />
            ) : (
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#e8e6d9]/20 scrollbar-track-transparent">
                <table className="w-full min-w-[650px]">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-[#b8b5a7]">
                        Username
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-[#b8b5a7]">
                        Email
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-[#b8b5a7]">
                        Join Date
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-[#b8b5a7]">
                        Status
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-[#b8b5a7]">
                        Investment
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-[#b8b5a7]">
                        Commission
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedReferrals && paginatedReferrals.length > 0 ? (
                      paginatedReferrals.map((referral, index) => (
                        <motion.tr
                          key={referral.user?._id || index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-white/10 hover:bg-white/5"
                        >
                          <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-[#e8e6d9]">
                            {referral.user?.username || "Unknown User"}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-[#e8e6d9] max-w-[150px] truncate">
                            {referral.user?.email || "No email"}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-[#b8b5a7]">
                            {new Date(referral.joinedAt).toLocaleDateString()}
                          </td>
                          <td className="px-2 sm:px-4 py-3">
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                                referral.isActive
                                  ? "bg-green-900/30 text-green-400 border border-green-800"
                                  : "bg-red-900/30 text-red-400 border border-red-800"
                              }`}
                            >
                              {referral.isActive ? "Active" : "Inactive"}
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-[#e8e6d9]">
                            USDT {referral.totalDeposited?.toFixed(2) || "0.00"}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-[#e8e6d9]">
                            USDT {referral.earningsFromUser?.toFixed(2) || "0.00"}
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-[#b8b5a7]">
                          No referrals found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && user.referredUsers && user.referredUsers.length > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center text-sm text-[#b8b5a7]">
                  <span>Showing </span>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="mx-2 bg-[#060f20] border border-[#e8e6d9]/20 rounded text-[#e8e6d9] px-2 py-1"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <span>per page of {user.referredUsers.length} referrals</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`w-8 h-8 rounded-md flex items-center justify-center ${
                      currentPage === 1
                        ? "text-[#e8e6d9]/40 cursor-not-allowed"
                        : "text-[#e8e6d9] hover:bg-[#172a4b] border border-[#e8e6d9]/20"
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="hidden sm:flex items-center space-x-1">{renderPagination()}</div>

                  <div className="flex sm:hidden items-center">
                    <span className="text-[#e8e6d9] text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`w-8 h-8 rounded-md flex items-center justify-center ${
                      currentPage === totalPages
                        ? "text-[#e8e6d9]/40 cursor-not-allowed"
                        : "text-[#e8e6d9] hover:bg-[#172a4b] border border-[#e8e6d9]/20"
                    }`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          <div className="h-20 lg:h-0"></div>
        </div>
      </div>
    </main>
  )
}