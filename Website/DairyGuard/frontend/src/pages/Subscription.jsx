import React, { useState, useEffect } from 'react';
import { Check, ShieldCheck, Sparkles, Cpu, CreditCard, ArrowRight, Zap } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../config/subscriptionPlans';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AlertBanner from '../components/common/AlertBanner';

export default function Subscription({ onNavigate }) {
  const { isAuthenticated } = useAuth();
  const [currentPlanId, setCurrentPlanId] = useState('dairyguard-complete');
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      api.subscriptions.getCurrent()
        .then((data) => {
          if (data?.planId) {
            setCurrentPlanId(data.planId);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handleSelectPlan = async (planId) => {
    if (!isAuthenticated) {
      onNavigate('signup');
      return;
    }

    setLoadingPlan(planId);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await api.subscriptions.selectPlan(planId);
      setCurrentPlanId(planId);
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      setSuccessMessage(`Successfully updated subscription to ${plan?.name || 'selected plan'}!`);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update subscription. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div style={{ padding: '60px 0 80px' }}>
      <div className="section-container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.35)', padding: '8px 20px', borderRadius: '30px', color: '#22D3EE', fontSize: '0.95rem', fontWeight: 600, marginBottom: '18px' }}>
            <Cpu size={16} />
            <span>Modular IoT Hardware & Cloud Subscription</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', marginBottom: '18px' }}>
            Tailored Plans for Every <span className="text-gradient">Dairy Scale</span>
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '1.2rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Choose between focused cold-chain thermal monitoring, biochemical quality assurance, or complete end-to-end protection.
          </p>
        </div>

        {successMessage && <AlertBanner type="success" message={successMessage} onClose={() => setSuccessMessage('')} />}
        {errorMessage && <AlertBanner type="danger" message={errorMessage} onClose={() => setErrorMessage('')} />}

        {/* Pricing Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'stretch' }}>
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = currentPlanId === plan.id;
            const isHighlight = plan.highlight;

            return (
              <div
                key={plan.id}
                className="glass-card"
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '38px 30px',
                  borderRadius: '20px',
                  background: isHighlight 
                    ? 'linear-gradient(180deg, rgba(19, 36, 68, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)' 
                    : 'var(--bg-card)',
                  borderColor: isHighlight ? 'rgba(16, 185, 129, 0.55)' : (isCurrent ? 'rgba(6, 182, 212, 0.45)' : 'var(--border-subtle)'),
                  boxShadow: isHighlight ? '0 12px 36px rgba(16, 185, 129, 0.2)' : 'var(--shadow-md)'
                }}
              >
                {/* Badge Tag */}
                {plan.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-14px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: isHighlight ? 'linear-gradient(135deg, #10B981, #06B6D4)' : 'rgba(255, 255, 255, 0.15)',
                      color: isHighlight ? '#070B12' : '#FFFFFF',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      padding: '5px 16px',
                      borderRadius: '20px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px'
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                {/* Plan Title & Tagline */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.65rem', marginBottom: '8px', color: '#FFFFFF' }}>{plan.name}</h3>
                  <p style={{ fontSize: '1rem', color: '#CBD5E1', minHeight: '44px', lineHeight: 1.5 }}>{plan.tagline}</p>
                </div>

                {/* Price Breakdown */}
                <div style={{ padding: '22px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '14px', marginBottom: '26px' }}>
                  {/* Monthly Cloud Subscription */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '2.6rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-display)' }}>
                      {plan.currency}{plan.monthlyCost}
                    </span>
                    <span style={{ fontSize: '1.02rem', color: '#CBD5E1' }}>/ month</span>
                  </div>

                  {/* One-time Device Cost */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: '#34D399', borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '12px' }}>
                    <Cpu size={18} />
                    <span>One-time hardware kit: <strong>{plan.currency}{plan.deviceCost}</strong></span>
                  </div>
                </div>

                {/* Feature Checklist */}
                <div style={{ flex: 1, marginBottom: '32px' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px' }}>
                    Included Capabilities
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', padding: 0 }}>
                    {plan.features.map((feature, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '1rem', color: '#FFFFFF', lineHeight: 1.5 }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Action Button */}
                <button
                  className={`btn ${isHighlight ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', padding: '12px' }}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={loadingPlan === plan.id}
                >
                  {loadingPlan === plan.id ? (
                    <span>Processing...</span>
                  ) : isCurrent ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Check size={16} />
                      <span>Current Active Plan</span>
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>Select {plan.name}</span>
                      <ArrowRight size={16} />
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
