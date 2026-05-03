'use client'
import { useState } from 'react' 
import Link from 'next/link' 

export default function Navbar() {
     const [menuOpen, setMenuOpen] = useState(false)
     
     
     return ( 
        <nav style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '1rem 2rem', 
            background: '#fafafa', 
            borderBottom: '0.5px solid rgba(0,0,0,0.09)', 
            position: 'sticky', 
            top: 0, 
            zIndex: 200, 
            gap: '1rem', 
            flexWrap: 'wrap',
        }}>
        
        {/* LOGO */} 
        <Link href="/" style={{ textDecoration: 'none' }}> 
            <span style={{ 
                fontFamily: 'Georgia, serif', 
                fontSize: '1.8rem', 
                fontWeight: '500', 
                letterSpacing: '0.15em', 
                color: '#0a0a0a',
            }}>
                AV<span style={{ color: '#C9A84C' }}>O</span>RA 
             </span>
             </Link>
             
            {/* SEARCH BAR */} 
            <div style={{ 
                flex: 1, 
                maxWidth: '480px', 
                position: 'relative', 
            }}> 
                <input 
                    type="text"
                    placeholder="Search items, services, stores..."
                    style={{ 
                        width: '100%', 
                        padding: '0.65rem 3rem 0.65rem 1.1rem', 
                        border: '0.5px solid rgba(0,0,0,0.09)', 
                        background: '#f5f3ee', 
                        fontFamily: 'Arial, sans-serif', 
                        fontSize: '0.72rem', 
                        color: '#0a0a0a', 
                        outline: 'none', 
                        borderRadius: '0', 
                    }}
                />
                <button style={{ 
                    position: 'absolute', 
                    right: 0, 
                    top: 0, 
                    bottom: 0, 
                    width: '42px', 
                    background: '#0a0a0a', 
                    border: 'none', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                }}> 
                    <svg width="15" height="15" viewBox="0 0 24 24" 
                        fill="none" stroke="#fafafa" strokeWidth="2"> 
                        <circle cx="11" cy="11" r="8"/> 
                        <path d="M21 21l-4.35-4.35"/> 
                    </svg> 
                </button> 
            </div> 
            
            {/* NAV ACTIONS */} 
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}> 
                
                {/* Messages */} 
                <NavIconBtn title="Messages"> 
                    <svg width="16" height="16" viewBox="0 0 24 24" 
                        fill="none" stroke="#0a0a0a" strokeWidth="1.5"> 
                        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 
                        8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 
                        15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/> 
                    </svg> 
                </NavIconBtn>

                {/* Wishlist */} 
                <NavIconBtn title="Wishlist"> 
                    <svg width="16" height="16" viewBox="0 0 24 24" 
                        fill="none" stroke="#0a0a0a" strokeWidth="1.5"> 
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06 
                        -1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78 
                        -7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/> 
                    </svg>
                </NavIconBtn>
                
                {/* Cart */}
                <NavIconBtn title="Cart"> 
                    <svg width="16" height="16" viewBox="0 0 24 24" 
                        fill="none" stroke="#0a0a0a" strokeWidth="1.5"> 
                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 
                        2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 
                        4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/> 
                    </svg> 
                </NavIconBtn> 
                
                {/* Sign Up Button */} 
                <Link href="/signup" style={{ textDecoration: 'none' }}> 
                    <button style={{ 
                        background: '#0a0a0a', 
                        color: '#fafafa', 
                        border: 'none', 
                        padding: '0.55rem 1.2rem', 
                        fontFamily: 'Arial, sans-serif', 
                        fontSize: '0.6rem', 
                        fontWeight: '600', 
                        letterSpacing: '0.2em', 
                        textTransform: 'uppercase', 
                        cursor: 'pointer', 
                    }}> 
                        Sign Up 
                    </button> 
                </Link> 
                    
                {/* Login */} 
                <Link href="/login" style={{ textDecoration: 'none' }}> 
                    <button style={{ 
                        background: 'transparent', 
                        color: '#0a0a0a', 
                        border: '0.5px solid rgba(0,0,0,0.15)', 
                        padding: '0.55rem 1.2rem', 
                        fontFamily: 'Arial, sans-serif', 
                        fontSize: '0.6rem', 
                        letterSpacing: '0.2em', 
                        textTransform: 'uppercase', 
                        cursor: 'pointer', 
                    }}>
                        Log In 
                    </button> 
                </Link> 
                
            </div> 
        </nav> 
    ) 
} 
// Reusable icon button component
 function NavIconBtn({ children, title, badge }) { 
    return ( 
        <button 
            title={title} 
            style={{ 
                width: '36px', 
                height: '36px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                border: '0.5px solid rgba(0,0,0,0.09)', 
                background: 'transparent', 
                cursor: 'pointer', 
                position: 'relative', 
            }} 
        > 
            {children} 
            {badge && ( 
                <span style={{ 
                    position: 'absolute', 
                    top: '-5px', 
                    right: '-5px', 
                    width: '16px', 
                    height: '16px', 
                    borderRadius: '50%', 
                    background: '#C9A84C', 
                    fontSize: '0.48rem', 
                    color: '#0a0a0a', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: '700', 
                    border: '1.5px solid #fafafa', 
                }}> 
                    {badge} 
                </span> 
            )} 
        </button> 
    ) 
}