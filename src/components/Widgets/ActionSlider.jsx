import { Gift, ChartBar, Coffee, ArrowRight } from 'phosphor-react';
import './ActionSlider.css';

const ActionSlider = () => {
  return (
    <div className="widgets-wrapper">
      <h3 className="widgets-header">Suggested Actions</h3>
      
      <div className="widgets-scroll-container">
        
        {/* Widget 1: Referral */}
        <div className="widget-card widget-referral">
            <div className="widget-decor-circle"></div>
            <div className="widget-icon-box">
                <Gift size={24} color="white" weight="fill" />
            </div>
            <div className="widget-text">
                <h4>Invite & Earn</h4>
                <p>Get $50 for friends</p>
            </div>
        </div>

        {/* Widget 2: Analytics */}
        <div className="widget-card widget-analytics">
            <div className="widget-decor-circle"></div>
            <div className="widget-icon-box">
                <ChartBar size={24} color="#10B981" weight="fill" />
            </div>
            <div className="widget-text">
                <h4>Spending</h4>
                <p>-$340 this week</p>
            </div>
        </div>

        <div className="widget-card widget-cashback">
            <div className="widget-decor-circle"></div>
            <div className="widget-icon-box">
                <Coffee size={24} color="white" weight="fill" />
            </div>
            <div className="widget-text">
                <h4>Cashback</h4>
                <p>5% off Starbucks</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ActionSlider;