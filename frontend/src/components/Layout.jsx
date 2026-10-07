import React, { useEffect, useState } from 'react'
import useLayoutStore from '../store/layoutStore'
import { useLocation } from 'react-router-dom'
import useThemeStore from '../store/themeStore'

const Layout = ({children, isThemeDialogOpen, toggleThemeDialog, isStatusPreviewOpen, statusPreviewContent}) => {
    const selectedContact= useLayoutStore(state=>state.selectedContact)
    const setSelectedContact= useLayoutStore(state=>state.setSelectedContact)
    const location=useLocation()
    const [isMobile, setIsMobile]= useState(window.innerWidth<768)
    const {theme, setTheme}= useThemeStore()

    useEffect(()=>{
        const handleResize=()=>{
            setIsMobile(Window.innerWidth<768)
        }
        window.addEventListener("resize", handleResize)
        return()=>window.removeEventListener('resize', handleResize)
    }, [])
  return (
    <div className={``}>

    </div>
  )
}

export default Layout