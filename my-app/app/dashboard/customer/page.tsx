// 'use client'

// import { useState, useEffect } from 'react'
// import { useSession } from 'next-auth/react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { Calendar, Package, Clock, Plus, Edit, Trash2, ShoppingCart, Home, Search, Filter, Star, Heart, Menu, X, CreditCard, Receipt, TrendingUp, CalendarDays } from 'lucide-react'
// import toast from 'react-hot-toast'

// interface Product {
//   id: string
//   name: string
//   description: string
//   price: number
//   image?: string
//   category: string
// }

// interface Order {
//   id: string
//   status: string
//   totalAmount: number
//   deliveryDate: string
//   isRecurring: boolean
//   items: Array<{
//     product: Product
//     quantity: number
//     price: number
//   }>
// }

// interface MilkSubscription {
//   id: string
//   productId: string
//   quantity: number
//   isActive: boolean
//   startDate: string
//   endDate?: string
//   leaveDates: string[]
//   product: Product
// }

// interface Bill {
//   id: string
//   month: number
//   year: number
//   totalAmount: number
//   status: string
//   dueDate: string
//   paidAt?: string
//   paymentMethod?: string
//   whatsappSent: boolean
//   items: Array<{
//     product: Product
//     quantity: number
//     price: number
//     total: number
//   }>
// }

// export default function CustomerDashboard() {
//   const { data: session, status } = useSession()
//   const router = useRouter()
//   const [products, setProducts] = useState<Product[]>([])
//   const [orders, setOrders] = useState<Order[]>([])
//   const [showProductModal, setShowProductModal] = useState(false)
//   const [selectedProducts, setSelectedProducts] = useState<{[key: string]: number}>({})
//   const [deliveryDate, setDeliveryDate] = useState('')
//   const [isRecurring, setIsRecurring] = useState(false)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedCategory, setSelectedCategory] = useState('')
//   const [showProductBrowser, setShowProductBrowser] = useState(false)
//   const [cart, setCart] = useState<{[key: string]: number}>({})
//   const [subscriptions, setSubscriptions] = useState<MilkSubscription[]>([])
//   const [bills, setBills] = useState<Bill[]>([])
//   const [showSidebar, setShowSidebar] = useState(false)
//   const [activeTab, setActiveTab] = useState('dashboard')
//   const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
//   const [selectedSubscription, setSelectedSubscription] = useState<MilkSubscription | null>(null)
//   const [subscriptionForm, setSubscriptionForm] = useState({
//     productId: '',
//     quantity: '',
//     startDate: '',
//     endDate: '',
//     leaveDates: [] as string[]
//   })

//   useEffect(() => {
//     if (status === 'unauthenticated') {
//       router.push('/auth/signin')
//     }
//     if (session?.user.userType !== 'CUSTOMER') {
//       router.push('/')
//     }
//   }, [session, status, router])

//   useEffect(() => {
//     fetchProducts()
//     fetchOrders()
//     fetchSubscriptions()
//     fetchBills()
//   }, [])

//   const fetchProducts = async () => {
//     try {
//       const response = await fetch('/api/products')
//       if (response.ok) {
//         const data = await response.json()
//         setProducts(data)
//       }
//     } catch (error) {
//       toast.error('Failed to fetch products')
//     }
//   }

//   const fetchOrders = async () => {
//     try {
//       const response = await fetch('/api/orders/customer')
//       if (response.ok) {
//         const data = await response.json()
//         setOrders(data)
//       }
//     } catch (error) {
//       toast.error('Failed to fetch orders')
//     }
//   }

//   const fetchSubscriptions = async () => {
//     try {
//       const response = await fetch('/api/subscriptions/customer')
//       if (response.ok) {
//         const data = await response.json()
//         setSubscriptions(data)
//       }
//     } catch (error) {
//       toast.error('Failed to fetch subscriptions')
//     }
//   }

//   const fetchBills = async () => {
//     try {
//       const response = await fetch('/api/bills/customer')
//       if (response.ok) {
//         const data = await response.json()
//         setBills(data)
//       }
//     } catch (error) {
//       toast.error('Failed to fetch bills')
//     }
//   }

//   const handleAddToCart = (productId: string, quantity: number) => {
//     if (quantity > 0) {
//       setSelectedProducts(prev => ({
//         ...prev,
//         [productId]: (prev[productId] || 0) + quantity
//       }))
//     }
//   }

//   const addToCart = (productId: string) => {
//     setCart(prev => ({
//       ...prev,
//       [productId]: (prev[productId] || 0) + 1
//     }))
//     toast.success('Added to cart!')
//   }

//   const removeFromCart = (productId: string) => {
//     setCart(prev => {
//       const newCart = { ...prev }
//       if (newCart[productId] > 1) {
//         newCart[productId] -= 1
//       } else {
//         delete newCart[productId]
//       }
//       return newCart
//     })
//   }

//   const getCartTotal = () => {
//     return Object.entries(cart).reduce((total, [productId, quantity]) => {
//       const product = products.find(p => p.id === productId)
//       return total + (product?.price || 0) * quantity
//     }, 0)
//   }

//   const getCartItemCount = () => {
//     return Object.values(cart).reduce((total, quantity) => total + quantity, 0)
//   }

//   const filteredProducts = products.filter(product => {
//     const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          product.description.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesCategory = !selectedCategory || product.category === selectedCategory
//     return matchesSearch && matchesCategory
//   })

//   const categories = [...new Set(products.map(p => p.category))]

//   const handleCreateSubscription = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       const response = await fetch('/api/subscriptions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           productId: subscriptionForm.productId,
//           quantity: parseFloat(subscriptionForm.quantity),
//           startDate: subscriptionForm.startDate,
//           endDate: subscriptionForm.endDate || null,
//           leaveDates: subscriptionForm.leaveDates
//         }),
//       })

//       if (response.ok) {
//         toast.success('Subscription created successfully!')
//         setShowSubscriptionModal(false)
//         setSubscriptionForm({
//           productId: '',
//           quantity: '',
//           startDate: '',
//           endDate: '',
//           leaveDates: []
//         })
//         fetchSubscriptions()
//       } else {
//         toast.error('Failed to create subscription')
//       }
//     } catch (error) {
//       toast.error('Error creating subscription')
//     }
//   }

//   const handleUpdateSubscription = async (subscriptionId: string, updates: any) => {
//     try {
//       const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updates),
//       })

//       if (response.ok) {
//         toast.success('Subscription updated successfully!')
//         fetchSubscriptions()
//       } else {
//         toast.error('Failed to update subscription')
//       }
//     } catch (error) {
//       toast.error('Error updating subscription')
//     }
//   }

//   const handleDeleteSubscription = async (subscriptionId: string) => {
//     if (confirm('Are you sure you want to delete this subscription?')) {
//       try {
//         const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
//           method: 'DELETE',
//         })

//         if (response.ok) {
//           toast.success('Subscription deleted successfully!')
//           fetchSubscriptions()
//         } else {
//           toast.error('Failed to delete subscription')
//         }
//       } catch (error) {
//         toast.error('Error deleting subscription')
//       }
//     }
//   }

//   const getTotalMonthlyQuantity = () => {
//     return subscriptions
//       .filter(sub => sub.isActive)
//       .reduce((total, sub) => total + (sub.quantity * 30), 0)
//   }

//   const getTotalMonthlyAmount = () => {
//     return subscriptions
//       .filter(sub => sub.isActive)
//       .reduce((total, sub) => total + (sub.quantity * sub.product.price * 30), 0)
//   }

//   const handleCreateOrder = async () => {
//     if (!deliveryDate) {
//       toast.error('Please select a delivery date')
//       return
//     }

//     const orderItems = Object.entries(selectedProducts)
//       .filter(([_, quantity]) => quantity > 0)
//       .map(([productId, quantity]) => {
//         const product = products.find(p => p.id === productId)
//         return {
//           productId,
//           quantity,
//           price: product?.price || 0
//         }
//       })

//     if (orderItems.length === 0) {
//       toast.error('Please add at least one product')
//       return
//     }

//     try {
//       const response = await fetch('/api/orders', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           items: orderItems,
//           deliveryDate,
//           isRecurring,
//           recurringType: isRecurring ? 'monthly' : null
//         }),
//       })

//       if (response.ok) {
//         toast.success('Order created successfully!')
//         setSelectedProducts({})
//         setDeliveryDate('')
//         setIsRecurring(false)
//         setShowProductModal(false)
//         fetchOrders()
//       } else {
//         toast.error('Failed to create order')
//       }
//     } catch (error) {
//       toast.error('Something went wrong')
//     }
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'PENDING': return 'bg-yellow-100 text-yellow-800'
//       case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
//       case 'OUT_FOR_DELIVERY': return 'bg-purple-100 text-purple-800'
//       case 'DELIVERED': return 'bg-green-100 text-green-800'
//       case 'CANCELLED': return 'bg-red-100 text-red-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   if (status === 'loading') {
//     return <div className="min-h-screen flex items-center justify-center">Loading...</div>
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-6">
//                 <div>
//                   <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
//                   <p className="text-gray-600">Welcome back, {session?.user.name}</p>
//                 </div>
//                 <div className="flex items-center space-x-4">
//                   <button
//                     onClick={() => setShowSidebar(!showSidebar)}
//                     className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
//                   >
//                     <Menu className="h-4 w-4 mr-2" />
//                     <span>Menu</span>
//                   </button>
//                   <Link
//                     href="/"
//                     className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
//                   >
//                     <Home className="h-4 w-4" />
//                     <span>Home</span>
//                   </Link>
//                   <button
//                     onClick={() => setShowProductBrowser(true)}
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
//                   >
//                     <ShoppingCart className="h-5 w-5 mr-2" />
//                     Browse Products ({getCartItemCount()})
//                   </button>
//                   <button
//                     onClick={() => setShowSubscriptionModal(true)}
//                     className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
//                   >
//                     <CalendarDays className="h-5 w-5 mr-2" />
//                     Subscribe
//                   </button>
//                   <button
//                     onClick={() => setShowProductModal(true)}
//                     className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
//                   >
//                     <Plus className="h-5 w-5 mr-2" />
//                     New Order
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={() => setShowSidebar(!showSidebar)}
//                 className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
//               >
//                 <Menu className="h-4 w-4 mr-2" />
//                 <span>Menu</span>
//               </button>
//               <Link
//                 href="/"
//                 className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
//               >
//                 <Home className="h-4 w-4" />
//                 <span>Home</span>
//               </Link>
//               <button
//                 onClick={() => setShowProductBrowser(true)}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
//               >
//                 <ShoppingCart className="h-5 w-5 mr-2" />
//                 Browse Products ({getCartItemCount()})
//               </button>
//               <button
//                 onClick={() => setShowSubscriptionModal(true)}
//                 className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
//               >
//                 <CalendarDays className="h-5 w-5 mr-2" />
//                 Subscribe
//               </button>
//               <button
//                 onClick={() => setShowProductModal(true)}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
//               >
//                 <Plus className="h-5 w-5 mr-2" />
//                 New Order
//               </button>
//             </div>
//           </div>
//           </div>
//         </div>
//       </header>

//       {/* Sidebar */}
//       {showSidebar && (
//         <div className="fixed inset-0 z-50 overflow-hidden">
//           <div className="absolute inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowSidebar(false)}></div>
//           <div className="relative flex flex-col w-80 h-full bg-white shadow-xl">
//             <div className="flex items-center justify-between p-4 border-b">
//               <h2 className="text-lg font-semibold text-gray-900">Customer Menu</h2>
//               <button
//                 onClick={() => setShowSidebar(false)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X className="h-6 w-6" />
//               </button>
//             </div>
            
//             <div className="flex-1 overflow-y-auto">
//               <nav className="p-4 space-y-2">
//                 <button
//                   onClick={() => { setActiveTab('dashboard'); setShowSidebar(false); }}
//                   className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
//                     activeTab === 'dashboard' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   <TrendingUp className="h-5 w-5 mr-3" />
//                   Dashboard
//                 </button>
//                 <button
//                   onClick={() => { setActiveTab('subscriptions'); setShowSidebar(false); }}
//                   className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
//                     activeTab === 'subscriptions' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   <CalendarDays className="h-5 w-5 mr-3" />
//                   My Subscriptions
//                 </button>
//                 <button
//                   onClick={() => { setActiveTab('bills'); setShowSidebar(false); }}
//                   className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
//                     activeTab === 'bills' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   <Receipt className="h-5 w-5 mr-3" />
//                   Bills & Payments
//                 </button>
//                 <button
//                   onClick={() => { setActiveTab('orders'); setShowSidebar(false); }}
//                   className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
//                     activeTab === 'orders' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   <Package className="h-5 w-5 mr-3" />
//                   Order History
//                 </button>
//               </nav>
//             </div>
            
//             <div className="p-4 border-t bg-gray-50">
//               <div className="text-sm text-gray-600">
//                 <div className="flex justify-between mb-2">
//                   <span>Monthly Quantity:</span>
//                   <span className="font-medium">{getTotalMonthlyQuantity().toFixed(1)}L</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Monthly Amount:</span>
//                   <span className="font-medium">₹{getTotalMonthlyAmount().toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Dashboard Tab */}
//         {activeTab === 'dashboard' && (
//           <div>
//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="flex items-center">
//               <div className="p-2 bg-indigo-100 rounded-lg">
//                 <Package className="h-6 w-6 text-indigo-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Orders</p>
//                 <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="flex items-center">
//               <div className="p-2 bg-green-100 rounded-lg">
//                 <Calendar className="h-6 w-6 text-green-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {orders.filter(order => order.isRecurring).length}
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="flex items-center">
//               <div className="p-2 bg-yellow-100 rounded-lg">
//                 <Clock className="h-6 w-6 text-yellow-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Pending Orders</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {orders.filter(order => order.status === 'PENDING').length}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Orders Table */}
//         <div className="bg-white shadow rounded-lg">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-lg font-medium text-gray-900">Your Orders</h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Order ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Delivery Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Type
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Total
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {orders.map((order) => (
//                   <tr key={order.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       #{order.id.slice(-8)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
//                         {order.status.replace('_', ' ')}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {new Date(order.deliveryDate).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {order.isRecurring ? (
//                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                           Recurring
//                         </span>
//                       ) : (
//                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                           One-time
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       ₹{order.totalAmount.toFixed(2)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//           </div>
//         )}

//         {/* Product Selection Modal */}
//       {showProductModal && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
//             <div className="mt-3">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-medium text-gray-900">Create New Order</h3>
//                 <button
//                   onClick={() => setShowProductModal(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   ×
//                 </button>
//               </div>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Delivery Date
//                   </label>
//                   <input
//                     type="date"
//                     value={deliveryDate}
//                     onChange={(e) => setDeliveryDate(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                     min={new Date().toISOString().split('T')[0]}
//                   />
//                 </div>
//                 </div>
                
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="recurring"
//                     checked={isRecurring}
//                     onChange={(e) => setIsRecurring(e.target.checked)}
//                     className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                   />
//                   <label htmlFor="recurring" className="ml-2 block text-sm text-gray-900">
//                     Make this a recurring monthly order
//                   </label>
//                 </div>
                
//                 <div>
//                   <h4 className="text-md font-medium text-gray-900 mb-3">Select Products</h4>
//                   <div className="space-y-3 max-h-60 overflow-y-auto">
//                     {products.map((product) => (
//                       <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
//                         <div className="flex-1">
//                           <h5 className="font-medium text-gray-900">{product.name}</h5>
//                           <p className="text-sm text-gray-600">{product.description}</p>
//                           <p className="text-sm font-medium text-indigo-600">₹{product.price}</p>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <button
//                             onClick={() => handleAddToCart(product.id, -1)}
//                             className="p-1 rounded-full hover:bg-gray-100"
//                             disabled={!selectedProducts[product.id]}
//                           >
//                             -
//                           </button>
//                           <span className="w-8 text-center">
//                             {selectedProducts[product.id] || 0}
//                           </span>
//                           <button
//                             onClick={() => handleAddToCart(product.id, 1)}
//                             className="p-1 rounded-full hover:bg-gray-100"
//                           >
//                             +
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
                
//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     onClick={() => setShowProductModal(false)}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleCreateOrder}
//                     className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
//                   >
//                     Create Order
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//           </div>
//         )}

//         {/* Subscriptions Tab */}
//         {activeTab === 'subscriptions' && (
//           <div>
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold text-gray-900">My Subscriptions</h2>
//               <button
//                 onClick={() => setShowSubscriptionModal(true)}
//                 className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
//               >
//                 <Plus className="h-5 w-5 mr-2" />
//                 New Subscription
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {subscriptions.map((subscription) => (
//                 <div key={subscription.id} className="bg-white p-6 rounded-lg shadow">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-lg font-medium text-gray-900">{subscription.product.name}</h3>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       subscription.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                     }`}>
//                       {subscription.isActive ? 'Active' : 'Inactive'}
//                     </span>
//                   </div>
                  
//                   <div className="space-y-2 mb-4">
//                     <div className="flex justify-between">
//                       <span className="text-sm text-gray-600">Daily Quantity:</span>
//                       <span className="font-medium">{subscription.quantity}L</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-sm text-gray-600">Monthly Quantity:</span>
//                       <span className="font-medium">{(subscription.quantity * 30).toFixed(1)}L</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-sm text-gray-600">Monthly Cost:</span>
//                       <span className="font-medium">₹{(subscription.quantity * subscription.product.price * 30).toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-sm text-gray-600">Start Date:</span>
//                       <span className="font-medium">{new Date(subscription.startDate).toLocaleDateString()}</span>
//                     </div>
//                     {subscription.endDate && (
//                       <div className="flex justify-between">
//                         <span className="text-sm text-gray-600">End Date:</span>
//                         <span className="font-medium">{new Date(subscription.endDate).toLocaleDateString()}</span>
//                       </div>
//                     )}
//                     {subscription.leaveDates.length > 0 && (
//                       <div>
//                         <span className="text-sm text-gray-600">Leave Dates:</span>
//                         <div className="mt-1 flex flex-wrap gap-1">
//                           {subscription.leaveDates.map((date, index) => (
//                             <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
//                               {new Date(date).toLocaleDateString()}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
                  
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => handleUpdateSubscription(subscription.id, { isActive: !subscription.isActive })}
//                       className={`flex-1 px-3 py-2 rounded-md text-sm font-medium ${
//                         subscription.isActive 
//                           ? 'bg-red-100 text-red-700 hover:bg-red-200' 
//                           : 'bg-green-100 text-green-700 hover:bg-green-200'
//                       }`}
//                     >
//                       {subscription.isActive ? 'Pause' : 'Resume'}
//                     </button>
//                     <button
//                       onClick={() => handleDeleteSubscription(subscription.id)}
//                       className="px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-medium"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             {subscriptions.length === 0 && (
//               <div className="text-center py-12">
//                 <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions yet</h3>
//                 <p className="text-gray-600 mb-4">Start a subscription to get regular deliveries of your favorite products.</p>
//                 <button
//                   onClick={() => setShowSubscriptionModal(true)}
//                   className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
//                 >
//                   Create Subscription
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Bills Tab */}
//         {activeTab === 'bills' && (
//           <div>
//             <h2 className="text-xl font-semibold text-gray-900 mb-6">Bills & Payments</h2>
            
//             <div className="space-y-4">
//               {bills.map((bill) => (
//                 <div key={bill.id} className="bg-white p-6 rounded-lg shadow">
//                   <div className="flex items-center justify-between mb-4">
//                     <div>
//                       <h3 className="text-lg font-medium text-gray-900">
//                         Bill for {new Date(bill.year, bill.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//                       </h3>
//                       <p className="text-sm text-gray-600">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-2xl font-bold text-gray-900">₹{bill.totalAmount.toFixed(2)}</p>
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         bill.status === 'PAID' ? 'bg-green-100 text-green-800' :
//                         bill.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
//                         'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {bill.status}
//                       </span>
//                     </div>
//                   </div>
                  
//                   <div className="mb-4">
//                     <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
//                     <div className="space-y-1">
//                       {bill.items.map((item, index) => (
//                         <div key={index} className="flex justify-between text-sm">
//                           <span>{item.product.name} ({item.quantity}L)</span>
//                           <span>₹{item.total.toFixed(2)}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
                  
//                   {bill.status !== 'PAID' && (
//                     <div className="flex space-x-3">
//                       <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
//                         <CreditCard className="h-4 w-4 mr-2 inline" />
//                         Pay Now
//                       </button>
//                       <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
//                         <Receipt className="h-4 w-4 mr-2 inline" />
//                         Download Bill
//                       </button>
//                     </div>
//                   )}
                  
//                   {bill.status === 'PAID' && bill.paidAt && (
//                     <div className="text-sm text-gray-600">
//                       Paid on {new Date(bill.paidAt).toLocaleDateString()} via {bill.paymentMethod}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
            
//             {bills.length === 0 && (
//               <div className="text-center py-12">
//                 <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No bills yet</h3>
//                 <p className="text-gray-600">Your monthly bills will appear here once you have active subscriptions.</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Orders Tab */}
//         {activeTab === 'orders' && (
//           <div>
//             <h2 className="text-xl font-semibold text-gray-900 mb-6">Order History</h2>
            
//             <div className="space-y-4">
//               {orders.map((order) => (
//                 <div key={order.id} className="bg-white p-6 rounded-lg shadow">
//                   <div className="flex items-center justify-between mb-4">
//                     <div>
//                       <h3 className="text-lg font-medium text-gray-900">Order #{order.id.slice(-8)}</h3>
//                       <p className="text-sm text-gray-600">
//                         {new Date(order.deliveryDate).toLocaleDateString()}
//                         {order.isRecurring && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Recurring</span>}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-xl font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
//                         order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-red-100 text-red-800'
//                       }`}>
//                         {order.status}
//                       </span>
//                     </div>
//                   </div>
                  
//                   <div>
//                     <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
//                     <div className="space-y-1">
//                       {order.items.map((item, index) => (
//                         <div key={index} className="flex justify-between text-sm">
//                           <span>{item.product.name} ({item.quantity}L)</span>
//                           <span>₹{item.price.toFixed(2)}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             {orders.length === 0 && (
//               <div className="text-center py-12">
//                 <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
//                 <p className="text-gray-600">Your order history will appear here once you place your first order.</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Subscription Modal */}
//       {showSubscriptionModal && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//             <div className="mt-3">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Subscription</h3>
//               <form onSubmit={handleCreateSubscription} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Product *</label>
//                   <select
//                     required
//                     value={subscriptionForm.productId}
//                     onChange={(e) => setSubscriptionForm({...subscriptionForm, productId: e.target.value})}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                   >
//                     <option value="">Select a product</option>
//                     {products.map(product => (
//                       <option key={product.id} value={product.id}>{product.name} - ₹{product.price}/L</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Daily Quantity (L) *</label>
//                   <input
//                     type="number"
//                     step="0.1"
//                     required
//                     value={subscriptionForm.quantity}
//                     onChange={(e) => setSubscriptionForm({...subscriptionForm, quantity: e.target.value})}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                     placeholder="e.g., 0.5"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Start Date *</label>
//                   <input
//                     type="date"
//                     required
//                     value={subscriptionForm.startDate}
//                     onChange={(e) => setSubscriptionForm({...subscriptionForm, startDate: e.target.value})}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">End Date (Optional)</label>
//                   <input
//                     type="date"
//                     value={subscriptionForm.endDate}
//                     onChange={(e) => setSubscriptionForm({...subscriptionForm, endDate: e.target.value})}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowSubscriptionModal(false)}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md"
//                   >
//                     Create Subscription
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Product Browser Modal */}
//       {showProductBrowser && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
//             <div className="mt-3">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-lg font-medium text-gray-900">Browse Products</h3>
//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center space-x-2">
//                     <ShoppingCart className="h-5 w-5 text-blue-600" />
//                     <span className="text-sm font-medium">Cart: {getCartItemCount()} items - ₹{getCartTotal().toFixed(2)}</span>
//                   </div>
//                   <button
//                     onClick={() => setShowProductBrowser(false)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     ✕
//                   </button>
//                 </div>
//               </div>

//               {/* Search and Filter */}
//               <div className="mb-6 flex flex-col sm:flex-row gap-4">
//                 <div className="flex-1">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <input
//                       type="text"
//                       placeholder="Search products..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                 </div>
//                 <div className="sm:w-48">
//                   <select
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                   >
//                     <option value="">All Categories</option>
//                     {categories.map(category => (
//                       <option key={category} value={category}>{category}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Products Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//                 {filteredProducts.map((product) => (
//                   <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                     <div className="aspect-w-16 aspect-h-9 mb-4">
//                       {product.image ? (
//                         <img
//                           src={product.image}
//                           alt={product.name}
//                           className="w-full h-32 object-cover rounded-lg"
//                         />
//                       ) : (
//                         <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
//                           <Package className="h-8 w-8 text-gray-400" />
//                         </div>
//                       )}
//                     </div>
//                     <div className="mb-3">
//                       <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
//                       <p className="text-sm text-gray-600 mb-2">{product.description}</p>
//                       <div className="flex items-center justify-between">
//                         <span className="text-lg font-semibold text-gray-900">₹{product.price}</span>
//                         <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
//                           {product.category}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={() => removeFromCart(product.id)}
//                           className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
//                           disabled={!cart[product.id]}
//                         >
//                           -
//                         </button>
//                         <span className="w-8 text-center text-sm">
//                           {cart[product.id] || 0}
//                         </span>
//                         <button
//                           onClick={() => addToCart(product.id)}
//                           className="p-1 rounded-full hover:bg-gray-100"
//                         >
//                           +
//                         </button>
//                       </div>
//                       <button
//                         onClick={() => addToCart(product.id)}
//                         className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center"
//                       >
//                         <ShoppingCart className="h-4 w-4 mr-1" />
//                         Add
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Cart Summary */}
//               {getCartItemCount() > 0 && (
//                 <div className="border-t pt-4">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <p className="text-sm text-gray-600">
//                         {getCartItemCount()} items in cart
//                       </p>
//                       <p className="text-lg font-semibold text-gray-900">
//                         Total: ₹{getCartTotal().toFixed(2)}
//                       </p>
//                     </div>
//                     <div className="flex space-x-3">
//                       <button
//                         onClick={() => {
//                           setCart({})
//                           toast.success('Cart cleared!')
//                         }}
//                         className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
//                       >
//                         Clear Cart
//                       </button>
//                       <button
//                         onClick={() => {
//                           setSelectedProducts(cart)
//                           setShowProductBrowser(false)
//                           setShowProductModal(true)
//                         }}
//                         className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
//                       >
//                         Proceed to Order
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Package,
  Clock,
  Plus,
  Edit,
  Trash2,
  ShoppingCart,
  Home,
  Search,
  Filter,
  Star,
  Heart,
  Menu,
  X,
  CreditCard,
  Receipt,
  TrendingUp,
  CalendarDays,
} from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  deliveryDate: string;
  isRecurring: boolean;
  items: Array<{
    product: Product;
    quantity: number;
    price: number;
  }>;
}

interface MilkSubscription {
  id: string;
  productId: string;
  quantity: number;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  leaveDates: string[];
  product: Product;
}

interface Bill {
  id: string;
  month: number;
  year: number;
  totalAmount: number;
  status: string;
  dueDate: string;
  paidAt?: string;
  paymentMethod?: string;
  whatsappSent: boolean;
  items: Array<{
    product: Product;
    quantity: number;
    price: number;
    total: number;
  }>;
}

export default function CustomerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: string]: number;
  }>({});
  const [deliveryDate, setDeliveryDate] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showProductBrowser, setShowProductBrowser] = useState(false);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [subscriptions, setSubscriptions] = useState<MilkSubscription[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<MilkSubscription | null>(null);
  const [subscriptionForm, setSubscriptionForm] = useState({
    productId: "",
    quantity: "",
    startDate: "",
    endDate: "",
    leaveDates: [] as string[],
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (session?.user.userType !== "CUSTOMER") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchSubscriptions();
    fetchBills();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders/customer");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch("/api/subscriptions/customer");
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data);
      }
    } catch (error) {
      toast.error("Failed to fetch subscriptions");
    }
  };

  const fetchBills = async () => {
    try {
      const response = await fetch("/api/bills/customer");
      if (response.ok) {
        const data = await response.json();
        setBills(data);
      }
    } catch (error) {
      toast.error("Failed to fetch bills");
    }
  };

  const handleAddToCart = (productId: string, quantity: number) => {
    if (quantity > 0) {
      setSelectedProducts((prev) => ({
        ...prev,
        [productId]: (prev[productId] || 0) + quantity,
      }));
    } else {
      setSelectedProducts((prev) => {
        const newProducts = { ...prev };
        if (newProducts[productId] > 0) {
          newProducts[productId] += quantity;
          if (newProducts[productId] <= 0) {
            delete newProducts[productId];
          }
        }
        return newProducts;
      });
    }
  };

  const addToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
    toast.success("Added to cart!");
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId] -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find((p) => p.id === productId);
      return total + (product?.price || 0) * quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map((p) => p.category))];

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: subscriptionForm.productId,
          quantity: parseFloat(subscriptionForm.quantity),
          startDate: subscriptionForm.startDate,
          endDate: subscriptionForm.endDate || null,
          leaveDates: subscriptionForm.leaveDates,
        }),
      });

      if (response.ok) {
        toast.success("Subscription created successfully!");
        setShowSubscriptionModal(false);
        setSubscriptionForm({
          productId: "",
          quantity: "",
          startDate: "",
          endDate: "",
          leaveDates: [],
        });
        fetchSubscriptions();
      } else {
        toast.error("Failed to create subscription");
      }
    } catch (error) {
      toast.error("Error creating subscription");
    }
  };

  const handleUpdateSubscription = async (
    subscriptionId: string,
    updates: any
  ) => {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        toast.success("Subscription updated successfully!");
        fetchSubscriptions();
      } else {
        toast.error("Failed to update subscription");
      }
    } catch (error) {
      toast.error("Error updating subscription");
    }
  };

  const handleDeleteSubscription = async (subscriptionId: string) => {
    if (confirm("Are you sure you want to delete this subscription?")) {
      try {
        const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("Subscription deleted successfully!");
          fetchSubscriptions();
        } else {
          toast.error("Failed to delete subscription");
        }
      } catch (error) {
        toast.error("Error deleting subscription");
      }
    }
  };

  const getTotalMonthlyQuantity = () => {
    return subscriptions
      .filter((sub) => sub.isActive)
      .reduce((total, sub) => total + sub.quantity * 30, 0);
  };

  const getTotalMonthlyAmount = () => {
    return subscriptions
      .filter((sub) => sub.isActive)
      .reduce((total, sub) => total + sub.quantity * sub.product.price * 30, 0);
  };

  const handleCreateOrder = async () => {
    if (!deliveryDate) {
      toast.error("Please select a delivery date");
      return;
    }

    const orderItems = Object.entries(selectedProducts)
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, quantity]) => {
        const product = products.find((p) => p.id === productId);
        return {
          productId,
          quantity,
          price: product?.price || 0,
        };
      });

    if (orderItems.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: orderItems,
          deliveryDate,
          isRecurring,
          recurringType: isRecurring ? "monthly" : null,
        }),
      });

      if (response.ok) {
        toast.success("Order created successfully!");
        setSelectedProducts({});
        setDeliveryDate("");
        setIsRecurring(false);
        setShowProductModal(false);
        fetchOrders();
      } else {
        toast.error("Failed to create order");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "OUT_FOR_DELIVERY":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Customer Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {session?.user.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center">
                <Menu className="h-4 w-4 mr-2" />
                <span>Menu</span>
              </button>
              <Link
                href="/"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <button
                onClick={() => setShowProductBrowser(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Browse Products ({getCartItemCount()})
              </button>
              <button
                onClick={() => setShowSubscriptionModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center">
                <CalendarDays className="h-5 w-5 mr-2" />
                Subscribe
              </button>
              <button
                onClick={() => setShowProductModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                New Order
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setShowSidebar(false)}></div>
          <div className="relative flex flex-col w-80 h-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Customer Menu
              </h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <nav className="p-4 space-y-2">
                <button
                  onClick={() => {
                    setActiveTab("dashboard");
                    setShowSidebar(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "dashboard"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <TrendingUp className="h-5 w-5 mr-3" />
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setActiveTab("subscriptions");
                    setShowSidebar(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "subscriptions"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <CalendarDays className="h-5 w-5 mr-3" />
                  My Subscriptions
                </button>
                <button
                  onClick={() => {
                    setActiveTab("bills");
                    setShowSidebar(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "bills"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <Receipt className="h-5 w-5 mr-3" />
                  Bills & Payments
                </button>
                <button
                  onClick={() => {
                    setActiveTab("orders");
                    setShowSidebar(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "orders"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <Package className="h-5 w-5 mr-3" />
                  Order History
                </button>
              </nav>
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="text-sm text-gray-600">
                <div className="flex justify-between mb-2">
                  <span>Monthly Quantity:</span>
                  <span className="font-medium">
                    {getTotalMonthlyQuantity().toFixed(1)}L
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Amount:</span>
                  <span className="font-medium">
                    ₹{getTotalMonthlyAmount().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Package className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {orders.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Active Subscriptions
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {subscriptions.filter((sub) => sub.isActive).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Pending Orders
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        orders.filter((order) => order.status === "PENDING")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Your Orders
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id.slice(-8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              order.status
                            )}`}>
                            {order.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(order.deliveryDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.isRecurring ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Recurring
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              One-time
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{order.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Product Selection Modal */}
        {showProductModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Create New Order
                  </h3>
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="text-gray-400 hover:text-gray-600">
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Date
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="recurring"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="recurring"
                      className="ml-2 block text-sm text-gray-900">
                      Make this a recurring monthly order
                    </label>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Select Products
                    </h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">
                              {product.name}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {product.description}
                            </p>
                            <p className="text-sm font-medium text-indigo-600">
                              ₹{product.price}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleAddToCart(product.id, -1)}
                              className="p-1 rounded-full hover:bg-gray-100"
                              disabled={!selectedProducts[product.id]}>
                              -
                            </button>
                            <span className="w-8 text-center">
                              {selectedProducts[product.id] || 0}
                            </span>
                            <button
                              onClick={() => handleAddToCart(product.id, 1)}
                              className="p-1 rounded-full hover:bg-gray-100">
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setShowProductModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateOrder}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
                      Create Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === "subscriptions" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                My Subscriptions
              </h2>
              <button
                onClick={() => setShowSubscriptionModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                New Subscription
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {subscription.product.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        subscription.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                      {subscription.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Daily Quantity:
                      </span>
                      <span className="font-medium">
                        {subscription.quantity}L
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Monthly Quantity:
                      </span>
                      <span className="font-medium">
                        {(subscription.quantity * 30).toFixed(1)}L
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Monthly Cost:
                      </span>
                      <span className="font-medium">
                        ₹
                        {(
                          subscription.quantity *
                          subscription.product.price *
                          30
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Start Date:</span>
                      <span className="font-medium">
                        {new Date(subscription.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    {subscription.endDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">End Date:</span>
                        <span className="font-medium">
                          {new Date(subscription.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {subscription.leaveDates.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600">
                          Leave Dates:
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {subscription.leaveDates.map((date, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                              {new Date(date).toLocaleDateString()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleUpdateSubscription(subscription.id, {
                          isActive: !subscription.isActive,
                        })
                      }
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium ${
                        subscription.isActive
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}>
                      {subscription.isActive ? "Pause" : "Resume"}
                    </button>
                    <button
                      onClick={() => handleDeleteSubscription(subscription.id)}
                      className="px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-medium">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {subscriptions.length === 0 && (
              <div className="text-center py-12">
                <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No subscriptions yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start a subscription to get regular deliveries of your
                  favorite products.
                </p>
                <button
                  onClick={() => setShowSubscriptionModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                  Create Subscription
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bills Tab */}
        {activeTab === "bills" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Bills & Payments
            </h2>

            <div className="space-y-4">
              {bills.map((bill) => (
                <div key={bill.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Bill for{" "}
                        {new Date(bill.year, bill.month - 1).toLocaleDateString(
                          "en-US",
                          { month: "long", year: "numeric" }
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Due: {new Date(bill.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{bill.totalAmount.toFixed(2)}
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bill.status === "PAID"
                            ? "bg-green-100 text-green-800"
                            : bill.status === "OVERDUE"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                        {bill.status}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                    <div className="space-y-1">
                      {bill.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm">
                          <span>
                            {item.product.name} ({item.quantity}L)
                          </span>
                          <span>₹{item.total.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {bill.status !== "PAID" && (
                    <div className="flex space-x-3">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                        <CreditCard className="h-4 w-4 mr-2 inline" />
                        Pay Now
                      </button>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                        <Receipt className="h-4 w-4 mr-2 inline" />
                        Download Bill
                      </button>
                    </div>
                  )}

                  {bill.status === "PAID" && bill.paidAt && (
                    <div className="text-sm text-gray-600">
                      Paid on {new Date(bill.paidAt).toLocaleDateString()} via{" "}
                      {bill.paymentMethod}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {bills.length === 0 && (
              <div className="text-center py-12">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No bills yet
                </h3>
                <p className="text-gray-600">
                  Your monthly bills will appear here once you have active
                  subscriptions.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order History
            </h2>

            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Order #{order.id.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.deliveryDate).toLocaleDateString()}
                        {order.isRecurring && (
                          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Recurring
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        ₹{order.totalAmount.toFixed(2)}
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm">
                          <span>
                            {item.product.name} ({item.quantity}L)
                          </span>
                          <span>₹{item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {orders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-600">
                  Your order history will appear here once you place your first
                  order.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Create New Subscription
              </h3>
              <form onSubmit={handleCreateSubscription} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product *
                  </label>
                  <select
                    required
                    value={subscriptionForm.productId}
                    onChange={(e) =>
                      setSubscriptionForm({
                        ...subscriptionForm,
                        productId: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ₹{product.price}/L
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Daily Quantity (L) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={subscriptionForm.quantity}
                    onChange={(e) =>
                      setSubscriptionForm({
                        ...subscriptionForm,
                        quantity: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 0.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={subscriptionForm.startDate}
                    onChange={(e) =>
                      setSubscriptionForm({
                        ...subscriptionForm,
                        startDate: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={subscriptionForm.endDate}
                    onChange={(e) =>
                      setSubscriptionForm({
                        ...subscriptionForm,
                        endDate: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSubscriptionModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md">
                    Create Subscription
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Product Browser Modal */}
      {showProductBrowser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Browse Products
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">
                      Cart: {getCartItemCount()} items - ₹
                      {getCartTotal().toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowProductBrowser(false)}
                    className="text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900">
                          ₹{product.price}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                          disabled={!cart[product.id]}>
                          -
                        </button>
                        <span className="w-8 text-center text-sm">
                          {cart[product.id] || 0}
                        </span>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="p-1 rounded-full hover:bg-gray-100">
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              {getCartItemCount() > 0 && (
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        {getCartItemCount()} items in cart
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        Total: ₹{getCartTotal().toFixed(2)}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setCart({});
                          toast.success("Cart cleared!");
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                        Clear Cart
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProducts(cart);
                          setShowProductBrowser(false);
                          setShowProductModal(true);
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
                        Proceed to Order
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}