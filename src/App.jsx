import { useMemo, useState } from 'react'
import { useToasts } from './hooks/useToasts'
import { useTheme } from './hooks/useTheme'
import { useCart } from './hooks/useCart'
import { useCatalog } from './hooks/useCatalog'
import Header from './components/Header'
import ToastContainer from './components/ToastContainer'
import Catalog from './components/Catalog'
import MobileCartBar from './components/MobileCartBar'
import CartDrawer from './components/CartDrawer'
import CheckoutModal from './components/CheckoutModal'


const EMPTY_CUSTOMER = { nombre: '', telefono: '', direccion: '' }

export default function App() {
  const { toasts, addToast, removeToast } = useToasts()
  const { darkMode, toggleDarkMode } = useTheme()
  const catalog = useCatalog(addToast)
  const cart = useCart(addToast)

  // Filtros
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas')

  // Modales
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)


  // Formulario de checkout
  const [customer, setCustomer] = useState(EMPTY_CUSTOMER)

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return catalog.products.filter((p) => {
      const matchesSearch =
        (p.nombre ?? '').toLowerCase().includes(query) ||
        (p.descripcion ?? '').toLowerCase().includes(query)
      const matchesCat = selectedCategory === 'Todas' || p.categoria === selectedCategory
      return matchesSearch && matchesCat
    })
  }, [catalog.products, searchQuery, selectedCategory])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('Todas')
  }

  const openCheckoutModal = () => {
    setIsCartOpen(false)
    setShowCheckoutModal(true)
  }

  const handleSubmitOrder = async () => {
    const ok = await catalog.processOrder({
      cart: cart.cart,
      customer,
      total: cart.cartSubtotal,
    })

    if (ok) {
      cart.clearCart()
      setCustomer(EMPTY_CUSTOMER)
      setShowCheckoutModal(false)
    }
  }


  return (
    <>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={catalog.categories}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenCart={() => setIsCartOpen(true)}
        totalCartItems={cart.totalCartItems}
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />

      <Catalog
        products={filteredProducts}
        getCartQuantity={cart.getCartQuantity}
        onAddToCart={cart.addToCart}
        onClearFilters={clearFilters}
      />

      <MobileCartBar
        totalCartItems={cart.totalCartItems}
        cartSubtotal={cart.cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart.cart}
        totalCartItems={cart.totalCartItems}
        cartSubtotal={cart.cartSubtotal}
        onUpdateQuantity={cart.updateQuantity}
        onRemove={cart.removeFromCart}
        onCheckout={openCheckoutModal}
      />

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        customer={customer}
        onCustomerChange={setCustomer}
        totalCartItems={cart.totalCartItems}
        cartSubtotal={cart.cartSubtotal}
        isSubmitting={catalog.isSubmitting}
        onSubmit={handleSubmitOrder}
      />

    </>
  )
}
