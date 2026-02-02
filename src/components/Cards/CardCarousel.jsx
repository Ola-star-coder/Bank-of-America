import { useState, useRef } from 'react';
import { Eye, EyeSlash, WifiHigh } from 'phosphor-react'; // Removed 'Star'
import './CardCarousel.css';

const CardCarousel = ({ userData, showBalance, toggleBalance }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef(null);

    // Card 2 Data (Virtual)
    const virtualCardData = {
        balance: 2450.00,
        number: '**** 8829',
        expiry: '09/29'
    };

    // Card 3 Data (Business/Gold)
    const savingsCardData = {
        balance: 125000.50,
        number: '**** 4402',
        expiry: '11/30'
    };

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const scrollLeft = scrollRef.current.scrollLeft;
            const cardWidth = scrollRef.current.offsetWidth;
            const index = Math.round(scrollLeft / cardWidth);
            setActiveIndex(index);
        }
    };

    return (
        <div className="carousel-wrapper">
            <div 
                className="cards-scroll-container" 
                ref={scrollRef}
                onScroll={handleScroll}
            >
                {/* --- CARD 1: MAIN (Royal Blue) --- */}
                <div className="bank-card card-theme-blue">
                    <div className="card-top">
                        <WifiHigh size={24} style={{transform: 'rotate(90deg)'}} />
                        <span className="card-brand">VISA</span>
                    </div>

                    <div className="card-balance-wrapper">
                        <span className="balance-label">Total Balance</span>
                        <h2 className="balance-amount">
                            {showBalance ? formatMoney(userData.balance) : '****'}
                            <button onClick={toggleBalance} className="eye-btn-card">
                                {showBalance ? <Eye size={16} /> : <EyeSlash size={16} />}
                            </button>
                        </h2>
                    </div>

                    <div className="card-bottom">
                        <span className="card-digits">{userData.accountNumber || '•••• 0000'}</span>
                        <div className="card-expiry">
                            <span>EXP </span>
                            <span>12/28</span>
                        </div>
                    </div>
                </div>

                {/* --- CARD 2: VIRTUAL (Stealth Black) --- */}
                <div className="bank-card card-theme-black">
                    <div className="card-top">
                        <WifiHigh size={24} style={{transform: 'rotate(90deg)'}} />
                        <span className="card-brand">Mastercard</span>
                    </div>

                    <div className="card-balance-wrapper">
                        <span className="balance-label">Virtual Card</span>
                        <h2 className="balance-amount">
                            {showBalance ? formatMoney(virtualCardData.balance) : '****'}
                        </h2>
                    </div>

                    <div className="card-bottom">
                        <span className="card-digits">{virtualCardData.number}</span>
                        <div className="card-expiry">
                            <span>EXP </span>
                            <span>{virtualCardData.expiry}</span>
                        </div>
                    </div>
                </div>

                {/* --- CARD 3: GOLD (Real Visa) --- */}
                <div className="bank-card card-theme-gold">
                    <div className="card-top">
                        {/* Now uses the real contactless icon */}
                        <WifiHigh size={24} style={{transform: 'rotate(90deg)'}} />
                        <span className="card-brand">VISA</span>
                    </div>

                    <div className="card-balance-wrapper">
                        <span className="balance-label">Business Account</span>
                        <h2 className="balance-amount">
                            {showBalance ? formatMoney(savingsCardData.balance) : '****'}
                        </h2>
                    </div>

                    <div className="card-bottom">
                        <span className="card-digits">{savingsCardData.number}</span>
                        <div className="card-expiry">
                            <span>EXP </span>
                            <span>{savingsCardData.expiry}</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Pagination Dots */}
            <div className="carousel-dots">
                {[0, 1, 2].map(idx => (
                    <div 
                        key={idx} 
                        className={`dot ${activeIndex === idx ? 'active' : ''}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default CardCarousel;