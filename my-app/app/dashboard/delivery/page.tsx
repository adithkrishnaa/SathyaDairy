'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Truck, MapPin, Clock, CheckCircle, XCircle, Package, Navigation, Home, DollarSign, Route, Plus, Users } from 'lucide-react'
import toast from 'react-hot-toast'

interface Delivery {
  id: string
  orderId: string
  status: string
  scheduledDate: string
  deliveredAt?: string
  notes?: string
  order: {
    id: string
    customer: {
      name: string
      email: string
      phone?: string
      address?: string
    }
    totalAmount: number
    items: Array<{
      product: {
        name: string
      }
      quantity: number
    }>
  }
}

export default function DeliveryDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [cashAmount, setCashAmount] = useState('')
  const [showCashModal, setShowCashModal] = useState(false)
  const [showRouteModal, setShowRouteModal] = useState(false)
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    location: '',
    landmark: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
    if (session?.user.userType !== 'DELIVERY_PERSON') {
      router.push('/')
    }
  }, [session, status, router])

  useEffect(() => {
    fetchDeliveries()
  }, [])

  const fetchDeliveries = async () => {
    try {
      const response = await fetch('/api/deliveries/delivery-person')
      if (response.ok) {
        const data = await response.json()
        setDeliveries(data)
      }
    } catch (error) {
      toast.error('Failed to fetch deliveries')
    }
  }

  const handleStatusUpdate = async (deliveryId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/deliveries/${deliveryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          notes: deliveryNotes,
          deliveredAt: newStatus === 'DELIVERED' ? new Date().toISOString() : undefined
        }),
      })

      if (response.ok) {
        toast.success('Delivery status updated successfully!')
        setShowDeliveryModal(false)
        setSelectedDelivery(null)
        setDeliveryNotes('')
        fetchDeliveries()
      } else {
        toast.error('Failed to update delivery status')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const openDeliveryModal = (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    setDeliveryNotes(delivery.notes || '')
    setShowDeliveryModal(true)
  }

  const handleCashCollection = async (deliveryId: string) => {
    try {
      const response = await fetch(`/api/deliveries/${deliveryId}/cash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cashReceived: parseFloat(cashAmount),
          paymentMethod: 'CASH'
        }),
      })

      if (response.ok) {
        toast.success('Cash collection recorded successfully!')
        setShowCashModal(false)
        setCashAmount('')
        fetchDeliveries()
      } else {
        toast.error('Failed to record cash collection')
      }
    } catch (error) {
      toast.error('Error recording cash collection')
    }
  }

  const handleAddCustomer = async () => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      })

      if (response.ok) {
        toast.success('Customer added successfully!')
        setShowAddCustomerModal(false)
        setNewCustomer({
          name: '',
          phone: '',
          address: '',
          location: '',
          landmark: ''
        })
      } else {
        toast.error('Failed to add customer')
      }
    } catch (error) {
      toast.error('Error adding customer')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800'
      case 'IN_TRANSIT': return 'bg-yellow-100 text-yellow-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return <Clock className="h-4 w-4" />
      case 'IN_TRANSIT': return <Truck className="h-4 w-4" />
      case 'DELIVERED': return <CheckCircle className="h-4 w-4" />
      case 'FAILED': return <XCircle className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'SCHEDULED': return 'IN_TRANSIT'
      case 'IN_TRANSIT': return 'DELIVERED'
      default: return null
    }
  }

  const getStatusButtonText = (currentStatus: string) => {
    switch (currentStatus) {
      case 'SCHEDULED': return 'Start Delivery'
      case 'IN_TRANSIT': return 'Mark as Delivered'
      default: return null
    }
  }

  const todayDeliveries = deliveries.filter(delivery => {
    const deliveryDate = new Date(delivery.scheduledDate)
    const today = new Date()
    return deliveryDate.toDateString() === today.toDateString()
  })

  const pendingDeliveries = deliveries.filter(delivery => 
    delivery.status === 'SCHEDULED' || delivery.status === 'IN_TRANSIT'
  )

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Delivery Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session?.user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <button
                onClick={() => setShowRouteModal(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Route className="h-4 w-4" />
                <span>Route Map</span>
              </button>
              <button
                onClick={() => setShowAddCustomerModal(true)}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                <span>Add Customer</span>
              </button>
              <div className="flex items-center space-x-2">
                <Navigation className="h-5 w-5 text-indigo-600" />
                <span className="text-sm text-gray-600">Delivery Person</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Deliveries</p>
                <p className="text-2xl font-bold text-gray-900">{todayDeliveries.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Truck className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Deliveries</p>
                <p className="text-2xl font-bold text-gray-900">{pendingDeliveries.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {todayDeliveries.filter(d => d.status === 'DELIVERED').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                <p className="text-2xl font-bold text-gray-900">{deliveries.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Deliveries */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Today's Deliveries</h2>
          </div>
          <div className="p-6">
            {todayDeliveries.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No deliveries scheduled for today</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {todayDeliveries.map((delivery) => (
                  <div key={delivery.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">#{delivery.orderId.slice(-8)}</h3>
                        <p className="text-sm text-gray-600">{delivery.order.customer.name}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(delivery.status)}`}>
                        {getStatusIcon(delivery.status)}
                        <span className="ml-1">{delivery.status.replace('_', ' ')}</span>
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="truncate">{delivery.order.customer.address || 'No address provided'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Package className="h-4 w-4 mr-2" />
                        <span>{delivery.order.items.length} item(s) - ₹{delivery.order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openDeliveryModal(delivery)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        View Details
                      </button>
                      {getNextStatus(delivery.status) && (
                        <button
                          onClick={() => handleStatusUpdate(delivery.id, getNextStatus(delivery.status)!)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                          {getStatusButtonText(delivery.status)}
                        </button>
                      )}
                      {delivery.status === 'DELIVERED' && (
                        <button
                          onClick={() => {
                            setSelectedDelivery(delivery)
                            setShowCashModal(true)
                          }}
                          className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center"
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Cash
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* All Deliveries */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Deliveries</h2>
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheduled Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveries.map((delivery) => (
                  <tr key={delivery.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{delivery.id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{delivery.order.customer.name}</div>
                        <div className="text-sm text-gray-500">{delivery.order.customer.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(delivery.status)}`}>
                        {getStatusIcon(delivery.status)}
                        <span className="ml-1">{delivery.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(delivery.scheduledDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{delivery.order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openDeliveryModal(delivery)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delivery Details Modal */}
      {showDeliveryModal && selectedDelivery && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Delivery Details</h3>
                <button
                  onClick={() => setShowDeliveryModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Delivery ID</label>
                    <p className="text-sm text-gray-900">#{selectedDelivery.id.slice(-8)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedDelivery.status)}`}>
                      {getStatusIcon(selectedDelivery.status)}
                      <span className="ml-1">{selectedDelivery.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer Information</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-900">{selectedDelivery.order.customer.name}</p>
                    <p className="text-sm text-gray-600">{selectedDelivery.order.customer.email}</p>
                    {selectedDelivery.order.customer.phone && (
                      <p className="text-sm text-gray-600">{selectedDelivery.order.customer.phone}</p>
                    )}
                    {selectedDelivery.order.customer.address && (
                      <p className="text-sm text-gray-600 mt-1">{selectedDelivery.order.customer.address}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order Items</label>
                  <div className="mt-1 space-y-2">
                    {selectedDelivery.order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-900">{item.product.name}</span>
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-right">
                    <span className="text-sm font-medium text-gray-900">
                      Total: ₹{selectedDelivery.order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delivery Notes</label>
                  <textarea
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    rows={3}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add delivery notes..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowDeliveryModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Close
                  </button>
                  {getNextStatus(selectedDelivery.status) && (
                    <button
                      onClick={() => handleStatusUpdate(selectedDelivery.id, getNextStatus(selectedDelivery.status)!)}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                    >
                      {getStatusButtonText(selectedDelivery.status)}
                    </button>
                  )}
                  {selectedDelivery.status === 'IN_TRANSIT' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedDelivery.id, 'FAILED')}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                    >
                      Mark as Failed
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cash Collection Modal */}
      {showCashModal && selectedDelivery && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Record Cash Collection</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Customer: {selectedDelivery.order.customer.name}</p>
                <p className="text-sm text-gray-600">Order Total: ₹{selectedDelivery.order.totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cash Amount Received</label>
                <input
                  type="number"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter amount"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowCashModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCashCollection(selectedDelivery.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                >
                  Record Cash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Route Map Modal */}
      {showRouteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Route Map</h3>
              <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Route className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Route map will be displayed here</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Integration with Google Maps or similar service
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Today's Deliveries:</h4>
                <div className="space-y-2">
                  {todayDeliveries.map((delivery, index) => (
                    <div key={delivery.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{delivery.order.customer.name}</p>
                          <p className="text-sm text-gray-600">{delivery.order.customer.address}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">₹{delivery.order.totalAmount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setShowRouteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Customer</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Customer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone *</label>
                  <input
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address *</label>
                  <textarea
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    rows={3}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Complete address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location *</label>
                  <input
                    type="text"
                    value={newCustomer.location}
                    onChange={(e) => setNewCustomer({...newCustomer, location: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Sector 15, Noida"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Landmark</label>
                  <input
                    type="text"
                    value={newCustomer.landmark}
                    onChange={(e) => setNewCustomer({...newCustomer, landmark: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Near Metro Station"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCustomer}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md"
                >
                  Add Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
