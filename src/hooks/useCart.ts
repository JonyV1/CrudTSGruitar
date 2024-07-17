import { useState, useEffect,useMemo } from "react"
import {db} from "../data/db"
import type { Guitar, CartItem } from "../types"

export const useCart = () => {

    const initialCart = () : CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    const MaxItem = 5
    const MinItem = 1

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(item : Guitar) {

        const itemExist = cart.findIndex((guitar) => guitar.id === item.id)
        if (itemExist >= 0) { //existe en el carrito
            if (cart[itemExist].quantity >= MaxItem) return
            const updateCart = [...cart]
            updateCart[itemExist].quantity++
            setCart(updateCart)
        } else {
            const newItem : CartItem = {...item, quantity:1}
            setCart([...cart, newItem])
        }

    }

    function removeFromCart(id : Guitar['id']) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    function increaseQuantity(id : Guitar['id']) {
        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity < MaxItem) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart(updatedCart)
    }
    function decrementQuantity(id : Guitar['id']) {
        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity > MinItem) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        setCart(updatedCart)
    }

    function clearCart() {
        setCart([])
    }

    //State Derivado
    const isEmpty = useMemo (() => cart.length === 0,[cart])
    const cartTotal = useMemo (() => cart.reduce((total,item) => total + (item.quantity * item.price),0),[cart])


    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decrementQuantity,
        clearCart,
        isEmpty,
        cartTotal

    }

}

