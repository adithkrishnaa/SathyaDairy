// 'use client'

// import { useState, useEffect } from 'react'
// import { useSession } from 'next-auth/react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { Package, Users, Truck, DollarSign, Plus, Edit, Trash2, Eye, Home, Menu, X, CreditCard, Receipt, TrendingUp, CalendarDays, MapPin, Phone, Mail, UserPlus, Search, Filter } from 'lucide-react'
// import toast from 'react-hot-toast'

// interface Product {
//   id: string
//   name: string
//   description: string
//   price: number
//   image?: string
//   category: string
//   isActive: boolean
// }

// interface Order {
//   id: string
//   status: string
//   totalAmount: number
//   deliveryDate: string
//   customer: {
//     name: string
//     email: string
//   }
//   items: Array<{
//     product: Product
//     quantity: number
//     price: number
//   }>
// }

// interface Delivery {
//   id: string
//   orderId: string
//   status: string
//   scheduledDate: string
//   deliveredAt?: string
//   deliveryPerson: {
//     name: string
//   }
//   order: {
//     customer: {
//       name: string
//     }
//     totalAmount: number
//   }
// }

// interface Customer {
//   id: string
//   name: string
//   email: string
//   phone?: string
//   address?: string
//   location?: string
//   landmark?: string
//   userType: string
//   isVerified: boolean
//   createdAt: string
//   _count?: {
//     orders: number
//     subscriptions: number
//   }
// }

// interface CustomerSubscription {
//   id: string
//   customerId: string
//   productId: string
//   quantity: number
//   isActive: boolean
//   startDate: string
//   endDate?: string
//   leaveDates: string[]
//   customer: {
//     name: string
//     phone?: string
//   }
//   product: {
//     name: string
//     price: number
//   }
// }

// interface CustomerBill {
//   id: string
//   customerId: string
//   month: number
//   year: number
//   totalAmount: number
//   status: string
//   dueDate: string
//   paidAt?: string
//   paymentMethod?: string
//   customer: {
//     name: string
//     phone?: string
//   }
//   items: Array<{
//     product: {
//       name: string
//     }
//     quantity: number
//     price: number
//     total: number
//   }>
// }

// export default function OwnerDashboard() {
//   const { data: session, status } = useSession()
//   const router = useRouter()
//   const [products, setProducts] = useState<Product[]>([])
//   const [orders, setOrders] = useState<Order[]>([])
//   const [deliveries, setDeliveries] = useState<Delivery[]>([])
//   const [showProductModal, setShowProductModal] = useState(false)
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null)
//   const [productForm, setProductForm] = useState({
//     name: '',
//     description: '',
//     price: '',
//     category: '',
//     image: ''
//   })
//   const [customers, setCustomers] = useState<Customer[]>([])
//   const [customerSubscriptions, setCustomerSubscriptions] = useState<CustomerSubscription[]>([])
//   const [customerBills, setCustomerBills] = useState<CustomerBill[]>([])
//   const [showCustomerModal, setShowCustomerModal] = useState(false)
//   const [showCustomerDetailsModal, setShowCustomerDetailsModal] = useState(false)
//   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
//   const [showSidebar, setShowSidebar] = useState(false)
//   const [activeTab, setActiveTab] = useState('dashboard')
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedCategory, setSelectedCategory] = useState('')
//   const [customerForm, setCustomerForm] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     location: '',
//     landmark: ''
//   })

//   useEffect(() => {
//     if (status === 'unauthenticated') {
//       router.push('/auth/signin')
//     }
//     if (session?.user.userType !== 'OWNER') {
//       router.push('/')
//     }
//   }, [session, status, router])

//   useEffect(() => {
//     fetchProducts()
//     fetchOrders()
//     fetchDeliveries()
//     fetchCustomers()
//     fetchCustomerSubscriptions()
//     fetchCustomerBills()
//   }, [])

//   const fetchProducts = async () => {
//     try {
//       const response = await fetch('/api/products/owner')
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
//       const response = await fetch('/api/orders/owner')
//       if (response.ok) {
//         const data = await response.json()
//         setOrders(data)
//       }
//     } catch (error) {
//       toast.error('Failed to fetch orders')
//     }
//   }

//   const fetchDeliveries = async () => {
//     try {
//       const response = await fetch('/api/deliveries/owner')
//       if (response.ok) {
//         const data = await response.json()
//         setDeliveries(data)
//       }
//     } catch (error) {
//       toast.error('Failed to fetch deliveries')
//     }
//   }

//   const fetchCustomers = async () => {
//     try {
//       const response = await fetch('/api/customers')
//       if (response.ok) {
//         const data = await response.json()
//         setCustomers(data)
//       }
//     } catch (error) {
//       toast.error('Failed to fetch customers')
//     }
//   }

//   const fetchCustomerSubscriptions = async () => {
//     try {
//       const response = await fetch('/api/subscriptions/all')
//       if (response.ok) {
//         const data = await response.json()
//         setCustomerSubscriptions(data)
//       }
//     } catch (error) {
//       toast.error('Failed to fetch customer subscriptions')
//     }
//   }

//   const fetchCustomerBills = async () => {
//     try {
//       const response = await fetch('/api/bills/all')
//       if (response.ok) {
//         const data = await response.json()
//         setCustomerBills(data)
//       }
//     } catch (error) {
//       toast.error('Failed to fetch customer bills')
//     }
//   }

//   const handleProductSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     try {
//       const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
//       const method = editingProduct ? 'PUT' : 'POST'
      
//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...productForm,
//           price: parseFloat(productForm.price)
//         }),
//       })

//       if (response.ok) {
//         toast.success(editingProduct ? 'Product updated successfully!' : 'Product created successfully!')
//         setProductForm({ name: '', description: '', price: '', category: '', image: '' })
//         setEditingProduct(null)
//         setShowProductModal(false)
//         fetchProducts()
//       } else {
//         toast.error('Failed to save product')
//       }
//     } catch (error) {
//       toast.error('Something went wrong')
//     }
//   }

//   const handleEditProduct = (product: Product) => {
//     setEditingProduct(product)
//     setProductForm({
//       name: product.name,
//       description: product.description || '',
//       price: product.price.toString(),
//       category: product.category,
//       image: product.image || ''
//     })
//     setShowProductModal(true)
//   }

//   const handleDeleteProduct = async (productId: string) => {
//     if (!confirm('Are you sure you want to delete this product?')) return
    
//     try {
//       const response = await fetch(`/api/products/${productId}`, {
//         method: 'DELETE',
//       })

//       if (response.ok) {
//         toast.success('Product deleted successfully!')
//         fetchProducts()
//       } else {
//         toast.error('Failed to delete product')
//       }
//     } catch (error) {
//       toast.error('Something went wrong')
//     }
//   }

//   const handleCustomerSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     try {
//       const response = await fetch('/api/customers', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(customerForm),
//       })

//       if (response.ok) {
//         toast.success('Customer added successfully!')
//         setShowCustomerModal(false)
//         setCustomerForm({
//           name: '',
//           email: '',
//           phone: '',
//           address: '',
//           location: '',
//           landmark: ''
//         })
//         fetchCustomers()
//       } else {
//         toast.error('Failed to add customer')
//       }
//     } catch (error) {
//       toast.error('Error adding customer')
//     }
//   }

//   const handleViewCustomerDetails = (customer: Customer) => {
//     setSelectedCustomer(customer)
//     setShowCustomerDetailsModal(true)
//   }

//   const getCustomerStats = () => {
//     const totalCustomers = customers.length
//     const activeSubscriptions = customerSubscriptions.filter(sub => sub.isActive).length
//     const totalMonthlyRevenue = customerBills
//       .filter(bill => bill.status === 'PAID')
//       .reduce((total, bill) => total + bill.totalAmount, 0)
//     const pendingBills = customerBills.filter(bill => bill.status === 'PENDING').length

//     return { totalCustomers, activeSubscriptions, totalMonthlyRevenue, pendingBills }
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

//   const getDeliveryStatusColor = (status: string) => {
//     switch (status) {
//       case 'SCHEDULED': return 'bg-blue-100 text-blue-800'
//       case 'IN_TRANSIT': return 'bg-yellow-100 text-yellow-800'
//       case 'DELIVERED': return 'bg-green-100 text-green-800'
//       case 'FAILED': return 'bg-red-100 text-red-800'
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
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
//               <p className="text-gray-600">Welcome back, {session?.user.name}</p>
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
//                 onClick={() => setShowCustomerModal(true)}
//                 className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
//               >
//                 <UserPlus className="h-5 w-5 mr-2" />
//                 Add Customer
//               </button>
//               <button
//                 onClick={() => {
//                   setEditingProduct(null)
//                   setProductForm({ name: '', description: '', price: '', category: '', image: '' })
//                   setShowProductModal(true)
//                 }}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
//               >
//                 <Plus className="h-5 w-5 mr-2" />
//                 Add Product
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Sidebar */}
//       {showSidebar && (
//         <div className="fixed inset-0 z-50 overflow-hidden">
//           <div className="absolute inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowSidebar(false)}></div>
//           <div className="relative flex flex-col w-80 h-full bg-white shadow-xl">
//             <div className="flex items-center justify-between p-4 border-b">
//               <h2 className="text-lg font-semibold text-gray-900">Owner Menu</h2>
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
//                   onClick={() => { setActiveTab('customers'); setShowSidebar(false); }}
//                   className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
//                     activeTab === 'customers' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   <Users className="h-5 w-5 mr-3" />
//                   Customers
//                 </button>
//                 <button
//                   onClick={() => { setActiveTab('subscriptions'); setShowSidebar(false); }}
//                   className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
//                     activeTab === 'subscriptions' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   <CalendarDays className="h-5 w-5 mr-3" />
//                   Subscriptions
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
//                   onClick={() => { setActiveTab('deliveries'); setShowSidebar(false); }}
//                   className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
//                     activeTab === 'deliveries' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   <Truck className="h-5 w-5 mr-3" />
//                   Deliveries
//                 </button>
//                 <button
//                   onClick={() => { setActiveTab('products'); setShowSidebar(false); }}
//                   className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
//                     activeTab === 'products' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   <Package className="h-5 w-5 mr-3" />
//                   Products
//                 </button>
//               </nav>
//             </div>
            
//             <div className="p-4 border-t bg-gray-50">
//               <div className="text-sm text-gray-600">
//                 <div className="flex justify-between mb-2">
//                   <span>Total Customers:</span>
//                   <span className="font-medium">{getCustomerStats().totalCustomers}</span>
//                 </div>
//                 <div className="flex justify-between mb-2">
//                   <span>Active Subscriptions:</span>
//                   <span className="font-medium">{getCustomerStats().activeSubscriptions}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Monthly Revenue:</span>
//                   <span className="font-medium">₹{getCustomerStats().totalMonthlyRevenue.toFixed(2)}</span>
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
//                 <p className="text-sm font-medium text-gray-600">Total Products</p>
//                 <p className="text-2xl font-bold text-gray-900">{products.length}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="flex items-center">
//               <div className="p-2 bg-green-100 rounded-lg">
//                 <Users className="h-6 w-6 text-green-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Orders</p>
//                 <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="flex items-center">
//               <div className="p-2 bg-yellow-100 rounded-lg">
//                 <Truck className="h-6 w-6 text-yellow-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Active Deliveries</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {deliveries.filter(d => d.status !== 'DELIVERED').length}
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="flex items-center">
//               <div className="p-2 bg-purple-100 rounded-lg">
//                 <DollarSign className="h-6 w-6 text-purple-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Revenue</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   ₹{orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Products Section */}
//         <div className="bg-white shadow rounded-lg mb-8">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-lg font-medium text-gray-900">Products</h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Product
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Category
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Price
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {products.map((product) => (
//                   <tr key={product.id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                         <div className="text-sm text-gray-500">{product.description}</div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {product.category}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       ₹{product.price.toFixed(2)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                         product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                       }`}>
//                         {product.isActive ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleEditProduct(product)}
//                           className="text-indigo-600 hover:text-indigo-900"
//                         >
//                           <Edit className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteProduct(product.id)}
//                           className="text-red-600 hover:text-red-900"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Recent Orders */}
//         <div className="bg-white shadow rounded-lg mb-8">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Order ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Customer
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Delivery Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Total
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {orders.slice(0, 10).map((order) => (
//                   <tr key={order.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       #{order.id.slice(-8)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
//                         <div className="text-sm text-gray-500">{order.customer.email}</div>
//                       </div>
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
//                       ₹{order.totalAmount.toFixed(2)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Delivery Status */}
//         <div className="bg-white shadow rounded-lg">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-lg font-medium text-gray-900">Delivery Status</h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Delivery ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Customer
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Delivery Person
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Scheduled Date
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {deliveries.slice(0, 10).map((delivery) => (
//                   <tr key={delivery.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       #{delivery.id.slice(-8)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {delivery.order.customer.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {delivery.deliveryPerson.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDeliveryStatusColor(delivery.status)}`}>
//                         {delivery.status.replace('_', ' ')}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {new Date(delivery.scheduledDate).toLocaleDateString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//           </div>
//         )}

//         {/* Customers Tab */}
//         {activeTab === 'customers' && (
//           <div>
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold text-gray-900">Customer Management</h2>
//               <button
//                 onClick={() => setShowCustomerModal(true)}
//                 className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
//               >
//                 <UserPlus className="h-5 w-5 mr-2" />
//                 Add Customer
//               </button>
//             </div>
            
//             <div className="bg-white shadow overflow-hidden sm:rounded-md">
//               <div className="px-4 py-5 sm:px-6">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900">All Customers</h3>
//                 <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage customer information and view details</p>
//               </div>
//               <ul className="divide-y divide-gray-200">
//                 {customers.map((customer) => (
//                   <li key={customer.id}>
//                     <div className="px-4 py-4 flex items-center justify-between">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0">
//                           <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
//                             <Users className="h-5 w-5 text-indigo-600" />
//                           </div>
//                         </div>
//                         <div className="ml-4">
//                           <div className="flex items-center">
//                             <p className="text-sm font-medium text-gray-900">{customer.name}</p>
//                             {customer.isVerified && (
//                               <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                 Verified
//                               </span>
//                             )}
//                           </div>
//                           <div className="flex items-center text-sm text-gray-500">
//                             <Mail className="h-4 w-4 mr-1" />
//                             {customer.email}
//                           </div>
//                           {customer.phone && (
//                             <div className="flex items-center text-sm text-gray-500">
//                               <Phone className="h-4 w-4 mr-1" />
//                               {customer.phone}
//                             </div>
//                           )}
//                           {customer.location && (
//                             <div className="flex items-center text-sm text-gray-500">
//                               <MapPin className="h-4 w-4 mr-1" />
//                               {customer.location}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={() => handleViewCustomerDetails(customer)}
//                           className="text-indigo-600 hover:text-indigo-900"
//                         >
//                           <Eye className="h-4 w-4" />
//                         </button>
//                         <span className="text-sm text-gray-500">
//                           {customer._count?.orders || 0} orders
//                         </span>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}

//         {/* Subscriptions Tab */}
//         {activeTab === 'subscriptions' && (
//           <div>
//             <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Subscriptions</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {customerSubscriptions.map((subscription) => (
//                 <div key={subscription.id} className="bg-white p-6 rounded-lg shadow">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-lg font-medium text-gray-900">{subscription.customer.name}</h3>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       subscription.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                     }`}>
//                       {subscription.isActive ? 'Active' : 'Inactive'}
//                     </span>
//                   </div>
                  
//                   <div className="space-y-2 mb-4">
//                     <div className="flex justify-between">
//                       <span className="text-sm text-gray-600">Product:</span>
//                       <span className="font-medium">{subscription.product.name}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-sm text-gray-600">Daily Quantity:</span>
//                       <span className="font-medium">{subscription.quantity}L</span>
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
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Bills Tab */}
//         {activeTab === 'bills' && (
//           <div>
//             <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Bills & Payments</h2>
            
//             <div className="space-y-4">
//               {customerBills.map((bill) => (
//                 <div key={bill.id} className="bg-white p-6 rounded-lg shadow">
//                   <div className="flex items-center justify-between mb-4">
//                     <div>
//                       <h3 className="text-lg font-medium text-gray-900">{bill.customer.name}</h3>
//                       <p className="text-sm text-gray-600">
//                         Bill for {new Date(bill.year, bill.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//                       </p>
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
                  
//                   {bill.status === 'PAID' && bill.paidAt && (
//                     <div className="text-sm text-gray-600">
//                       Paid on {new Date(bill.paidAt).toLocaleDateString()} via {bill.paymentMethod}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Deliveries Tab */}
//         {activeTab === 'deliveries' && (
//           <div>
//             <h2 className="text-xl font-semibold text-gray-900 mb-6">Delivery Management</h2>
            
//             <div className="bg-white shadow overflow-hidden sm:rounded-md">
//               <div className="px-4 py-5 sm:px-6">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900">All Deliveries</h3>
//                 <p className="mt-1 max-w-2xl text-sm text-gray-500">Track delivery status and manage routes</p>
//               </div>
//               <ul className="divide-y divide-gray-200">
//                 {deliveries.map((delivery) => (
//                   <li key={delivery.id}>
//                     <div className="px-4 py-4 flex items-center justify-between">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0">
//                           <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//                             <Truck className="h-5 w-5 text-blue-600" />
//                           </div>
//                         </div>
//                         <div className="ml-4">
//                           <div className="flex items-center">
//                             <p className="text-sm font-medium text-gray-900">{delivery.order.customer.name}</p>
//                             <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
//                               {delivery.status}
//                             </span>
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             Delivery Person: {delivery.deliveryPerson.name}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             Scheduled: {new Date(delivery.scheduledDate).toLocaleDateString()}
//                           </div>
//                           {delivery.deliveredAt && (
//                             <div className="text-sm text-gray-500">
//                               Delivered: {new Date(delivery.deliveredAt).toLocaleDateString()}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-sm font-medium text-gray-900">₹{delivery.order.totalAmount.toFixed(2)}</p>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}

//         {/* Products Tab */}
//         {activeTab === 'products' && (
//           <div>
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold text-gray-900">Product Management</h2>
//               <button
//                 onClick={() => {
//                   setEditingProduct(null)
//                   setProductForm({ name: '', description: '', price: '', category: '', image: '' })
//                   setShowProductModal(true)
//                 }}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
//               >
//                 <Plus className="h-5 w-5 mr-2" />
//                 Add Product
//               </button>
//             </div>
            
//             <div className="bg-white shadow overflow-hidden sm:rounded-md">
//               <div className="px-4 py-5 sm:px-6">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900">All Products</h3>
//                 <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your product inventory</p>
//               </div>
//               <ul className="divide-y divide-gray-200">
//                 {products.map((product) => (
//                   <li key={product.id}>
//                     <div className="px-4 py-4 flex items-center justify-between">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0">
//                           <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
//                             <Package className="h-5 w-5 text-indigo-600" />
//                           </div>
//                         </div>
//                         <div className="ml-4">
//                           <div className="flex items-center">
//                             <p className="text-sm font-medium text-gray-900">{product.name}</p>
//                             <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                               product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                             }`}>
//                               {product.isActive ? 'Active' : 'Inactive'}
//                             </span>
//                           </div>
//                           <p className="text-sm text-gray-500">{product.description}</p>
//                           <p className="text-sm text-gray-500">Category: {product.category}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-4">
//                         <div className="text-right">
//                           <p className="text-sm font-medium text-gray-900">₹{product.price}/L</p>
//                         </div>
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => handleEditProduct(product)}
//                             className="text-indigo-600 hover:text-indigo-900"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteProduct(product.id)}
//                             className="text-red-600 hover:text-red-900"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Customer Modal */}
//       {showCustomerModal && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//             <div className="mt-3">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Customer</h3>
//               <form onSubmit={handleCustomerSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Name *</label>
//                   <input
//                     type="text"
//                     required
//                     value={customerForm.name}
//                     onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email *</label>
//                   <input
//                     type="email"
//                     required
//                     value={customerForm.email}
//                     onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Phone</label>
//                   <input
//                     type="tel"
//                     value={customerForm.phone}
//                     onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Address</label>
//                   <textarea
//                     value={customerForm.address}
//                     onChange={(e) => setCustomerForm({...customerForm, address: e.target.value})}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                     rows={3}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Location</label>
//                   <input
//                     type="text"
//                     value={customerForm.location}
//                     onChange={(e) => setCustomerForm({...customerForm, location: e.target.value})}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Landmark</label>
//                   <input
//                     type="text"
//                     value={customerForm.landmark}
//                     onChange={(e) => setCustomerForm({...customerForm, landmark: e.target.value})}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowCustomerModal(false)}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md"
//                   >
//                     Add Customer
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Customer Details Modal */}
//       {showCustomerDetailsModal && selectedCustomer && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
//             <div className="mt-3">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-medium text-gray-900">Customer Details</h3>
//                 <button
//                   onClick={() => setShowCustomerDetailsModal(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   ×
//                 </button>
//               </div>
              
//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Name</label>
//                     <p className="mt-1 text-sm text-gray-900">{selectedCustomer.name}</p>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Email</label>
//                     <p className="mt-1 text-sm text-gray-900">{selectedCustomer.email}</p>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Phone</label>
//                     <p className="mt-1 text-sm text-gray-900">{selectedCustomer.phone || 'Not provided'}</p>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Status</label>
//                     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                       selectedCustomer.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {selectedCustomer.isVerified ? 'Verified' : 'Unverified'}
//                     </span>
//                   </div>
//                 </div>
                
//                 {selectedCustomer.address && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Address</label>
//                     <p className="mt-1 text-sm text-gray-900">{selectedCustomer.address}</p>
//                   </div>
//                 )}
                
//                 {selectedCustomer.location && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Location</label>
//                     <p className="mt-1 text-sm text-gray-900">{selectedCustomer.location}</p>
//                   </div>
//                 )}
                
//                 {selectedCustomer.landmark && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Landmark</label>
//                     <p className="mt-1 text-sm text-gray-900">{selectedCustomer.landmark}</p>
//                   </div>
//                 )}
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Member Since</label>
//                   <p className="mt-1 text-sm text-gray-900">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Product Modal */}
//       {showProductModal && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
//             <div className="mt-3">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-medium text-gray-900">
//                   {editingProduct ? 'Edit Product' : 'Add New Product'}
//                 </h3>
//                 <button
//                   onClick={() => setShowProductModal(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   ×
//                 </button>
//               </div>
              
//               <form onSubmit={handleProductSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Product Name
//                   </label>
//                   <input
//                     type="text"
//                     value={productForm.name}
//                     onChange={(e) => setProductForm({...productForm, name: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     value={productForm.description}
//                     onChange={(e) => setProductForm({...productForm, description: e.target.value})}
//                     rows={3}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Price (₹)
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={productForm.price}
//                       onChange={(e) => setProductForm({...productForm, price: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                       required
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Category
//                     </label>
//                     <select
//                       value={productForm.category}
//                       onChange={(e) => setProductForm({...productForm, category: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                       required
//                     >
//                       <option value="">Select Category</option>
//                       <option value="Milk">Milk</option>
//                       <option value="Curd">Curd</option>
//                       <option value="Butter">Butter</option>
//                       <option value="Cheese">Cheese</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Image URL (Optional)
//                   </label>
//                   <input
//                     type="url"
//                     value={productForm.image}
//                     onChange={(e) => setProductForm({...productForm, image: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
                
//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowProductModal(false)}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
//                   >
//                     {editingProduct ? 'Update Product' : 'Add Product'}
//                   </button>
//                 </div>
//               </form>
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
  Package,
  Users,
  Truck,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  Home,
  Menu,
  X,
  CreditCard,
  Receipt,
  TrendingUp,
  CalendarDays,
  MapPin,
  Phone,
  Mail,
  UserPlus,
  Search,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  isActive: boolean;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  deliveryDate: string;
  customer: {
    name: string;
    email: string;
  };
  items: Array<{
    product: Product;
    quantity: number;
    price: number;
  }>;
}

interface Delivery {
  id: string;
  orderId: string;
  status: string;
  scheduledDate: string;
  deliveredAt?: string;
  deliveryPerson: {
    name: string;
  };
  order: {
    customer: {
      name: string;
    };
    totalAmount: number;
  };
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  location?: string;
  landmark?: string;
  userType: string;
  isVerified: boolean;
  createdAt: string;
  _count?: {
    orders: number;
    subscriptions: number;
  };
}

interface CustomerSubscription {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  leaveDates: string[];
  customer: {
    name: string;
    phone?: string;
  };
  product: {
    name: string;
    price: number;
  };
}

interface CustomerBill {
  id: string;
  customerId: string;
  month: number;
  year: number;
  totalAmount: number;
  status: string;
  dueDate: string;
  paidAt?: string;
  paymentMethod?: string;
  customer: {
    name: string;
    phone?: string;
  };
  items: Array<{
    product: {
      name: string;
    };
    quantity: number;
    price: number;
    total: number;
  }>;
}

export default function OwnerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSubscriptions, setCustomerSubscriptions] = useState<
    CustomerSubscription[]
  >([]);
  const [customerBills, setCustomerBills] = useState<CustomerBill[]>([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showCustomerDetailsModal, setShowCustomerDetailsModal] =
    useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    location: "",
    landmark: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (session?.user.userType !== "OWNER") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchDeliveries();
    fetchCustomers();
    fetchCustomerSubscriptions();
    fetchCustomerBills();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products/owner");
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
      const response = await fetch("/api/orders/owner");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  const fetchDeliveries = async () => {
    try {
      const response = await fetch("/api/deliveries/owner");
      if (response.ok) {
        const data = await response.json();
        setDeliveries(data);
      }
    } catch (error) {
      toast.error("Failed to fetch deliveries");
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers");
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      toast.error("Failed to fetch customers");
    }
  };

  const fetchCustomerSubscriptions = async () => {
    try {
      const response = await fetch("/api/subscriptions/all");
      if (response.ok) {
        const data = await response.json();
        setCustomerSubscriptions(data);
      }
    } catch (error) {
      toast.error("Failed to fetch customer subscriptions");
    }
  };

  const fetchCustomerBills = async () => {
    try {
      const response = await fetch("/api/bills/all");
      if (response.ok) {
        const data = await response.json();
        setCustomerBills(data);
      }
    } catch (error) {
      toast.error("Failed to fetch customer bills");
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price),
        }),
      });

      if (response.ok) {
        toast.success(
          editingProduct
            ? "Product updated successfully!"
            : "Product created successfully!"
        );
        setProductForm({
          name: "",
          description: "",
          price: "",
          category: "",
          image: "",
        });
        setEditingProduct(null);
        setShowProductModal(false);
        fetchProducts();
      } else {
        toast.error("Failed to save product");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category,
      image: product.image || "",
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Product deleted successfully!");
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerForm),
      });

      if (response.ok) {
        toast.success("Customer added successfully!");
        setShowCustomerModal(false);
        setCustomerForm({
          name: "",
          email: "",
          phone: "",
          address: "",
          location: "",
          landmark: "",
        });
        fetchCustomers();
      } else {
        toast.error("Failed to add customer");
      }
    } catch (error) {
      toast.error("Error adding customer");
    }
  };

  const handleViewCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetailsModal(true);
  };

  const getCustomerStats = () => {
    const totalCustomers = customers.length;
    const activeSubscriptions = customerSubscriptions.filter(
      (sub) => sub.isActive
    ).length;
    const totalMonthlyRevenue = customerBills
      .filter((bill) => bill.status === "PAID")
      .reduce((total, bill) => total + bill.totalAmount, 0);
    const pendingBills = customerBills.filter(
      (bill) => bill.status === "PENDING"
    ).length;

    return {
      totalCustomers,
      activeSubscriptions,
      totalMonthlyRevenue,
      pendingBills,
    };
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

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "IN_TRANSIT":
        return "bg-yellow-100 text-yellow-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "FAILED":
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
                Owner Dashboard
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
                onClick={() => setShowCustomerModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Add Customer
              </button>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: "",
                    description: "",
                    price: "",
                    category: "",
                    image: "",
                  });
                  setShowProductModal(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Add Product
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
                Owner Menu
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
                    setActiveTab("customers");
                    setShowSidebar(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "customers"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <Users className="h-5 w-5 mr-3" />
                  Customers
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
                  Subscriptions
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
                    setActiveTab("deliveries");
                    setShowSidebar(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "deliveries"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <Truck className="h-5 w-5 mr-3" />
                  Deliveries
                </button>
                <button
                  onClick={() => {
                    setActiveTab("products");
                    setShowSidebar(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === "products"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <Package className="h-5 w-5 mr-3" />
                  Products
                </button>
              </nav>
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="text-sm text-gray-600">
                <div className="flex justify-between mb-2">
                  <span>Total Customers:</span>
                  <span className="font-medium">
                    {getCustomerStats().totalCustomers}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Active Subscriptions:</span>
                  <span className="font-medium">
                    {getCustomerStats().activeSubscriptions}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Revenue:</span>
                  <span className="font-medium">
                    ₹{getCustomerStats().totalMonthlyRevenue.toFixed(2)}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Package className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Products
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {products.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
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
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Truck className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Active Deliveries
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        deliveries.filter((d) => d.status !== "DELIVERED")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹
                      {orders
                        .reduce((sum, order) => sum + order.totalAmount, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="bg-white shadow rounded-lg mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Products</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="text-indigo-600 hover:text-indigo-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white shadow rounded-lg mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Recent Orders
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
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.slice(0, 10).map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id.slice(-8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.customer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customer.email}
                            </div>
                          </div>
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
                          ₹{order.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Delivery Status */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Delivery Status
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery Person
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Scheduled Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {deliveries.slice(0, 10).map((delivery) => (
                      <tr key={delivery.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{delivery.id.slice(-8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {delivery.order.customer.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {delivery.deliveryPerson.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDeliveryStatusColor(
                              delivery.status
                            )}`}>
                            {delivery.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(
                            delivery.scheduledDate
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === "customers" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Customer Management
              </h2>
              <button
                onClick={() => setShowCustomerModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Add Customer
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  All Customers
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Manage customer information and view details
                </p>
              </div>
              <ul className="divide-y divide-gray-200">
                {customers.map((customer) => (
                  <li key={customer.id}>
                    <div className="px-4 py-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-indigo-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              {customer.name}
                            </p>
                            {customer.isVerified && (
                              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="h-4 w-4 mr-1" />
                            {customer.email}
                          </div>
                          {customer.phone && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="h-4 w-4 mr-1" />
                              {customer.phone}
                            </div>
                          )}
                          {customer.location && (
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              {customer.location}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewCustomerDetails(customer)}
                          className="text-indigo-600 hover:text-indigo-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <span className="text-sm text-gray-500">
                          {customer._count?.orders || 0} orders
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === "subscriptions" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Customer Subscriptions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customerSubscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {subscription.customer.name}
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
                      <span className="text-sm text-gray-600">Product:</span>
                      <span className="font-medium">
                        {subscription.product.name}
                      </span>
                    </div>
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bills Tab */}
        {activeTab === "bills" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Customer Bills & Payments
            </h2>

            <div className="space-y-4">
              {customerBills.map((bill) => (
                <div key={bill.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {bill.customer.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Bill for{" "}
                        {new Date(bill.year, bill.month - 1).toLocaleDateString(
                          "en-US",
                          { month: "long", year: "numeric" }
                        )}
                      </p>
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

                  {bill.status === "PAID" && bill.paidAt && (
                    <div className="text-sm text-gray-600">
                      Paid on {new Date(bill.paidAt).toLocaleDateString()} via{" "}
                      {bill.paymentMethod}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deliveries Tab */}
        {activeTab === "deliveries" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Delivery Management
            </h2>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  All Deliveries
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Track delivery status and manage routes
                </p>
              </div>
              <ul className="divide-y divide-gray-200">
                {deliveries.map((delivery) => (
                  <li key={delivery.id}>
                    <div className="px-4 py-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Truck className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              {delivery.order.customer.name}
                            </p>
                            <span
                              className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                delivery.status
                              )}`}>
                              {delivery.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Delivery Person: {delivery.deliveryPerson.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Scheduled:{" "}
                            {new Date(
                              delivery.scheduledDate
                            ).toLocaleDateString()}
                          </div>
                          {delivery.deliveredAt && (
                            <div className="text-sm text-gray-500">
                              Delivered:{" "}
                              {new Date(
                                delivery.deliveredAt
                              ).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ₹{delivery.order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Product Management
              </h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: "",
                    description: "",
                    price: "",
                    category: "",
                    image: "",
                  });
                  setShowProductModal(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Add Product
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  All Products
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Manage your product inventory
                </p>
              </div>
              <ul className="divide-y divide-gray-200">
                {products.map((product) => (
                  <li key={product.id}>
                    <div className="px-4 py-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Package className="h-5 w-5 text-indigo-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              {product.name}
                            </p>
                            <span
                              className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                product.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                              {product.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {product.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            Category: {product.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ₹{product.price}/L
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-indigo-600 hover:text-indigo-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add New Customer
              </h3>
              <form onSubmit={handleCustomerSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerForm.name}
                    onChange={(e) =>
                      setCustomerForm({ ...customerForm, name: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerForm.email}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        email: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={customerForm.phone}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        phone: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    value={customerForm.address}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        address: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    value={customerForm.location}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        location: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={customerForm.landmark}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        landmark: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCustomerModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md">
                    Add Customer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      {showCustomerDetailsModal && selectedCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Customer Details
                </h3>
                <button
                  onClick={() => setShowCustomerDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600">
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedCustomer.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedCustomer.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedCustomer.phone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        selectedCustomer.isVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {selectedCustomer.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                </div>

                {selectedCustomer.address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedCustomer.address}
                    </p>
                  </div>
                )}

                {selectedCustomer.location && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedCustomer.location}
                    </p>
                  </div>
                )}

                {selectedCustomer.landmark && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Landmark
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedCustomer.landmark}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Member Since
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="text-gray-400 hover:text-gray-600">
                  ×
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          price: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required>
                      <option value="">Select Category</option>
                      <option value="Milk">Milk</option>
                      <option value="Curd">Curd</option>
                      <option value="Butter">Butter</option>
                      <option value="Cheese">Cheese</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={productForm.image}
                    onChange={(e) =>
                      setProductForm({ ...productForm, image: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}