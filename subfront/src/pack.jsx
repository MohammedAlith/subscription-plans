import React from 'react';

function Pack({ onSubscribe }) {
  const plans = [
    { name: 'Basic', price: 49, count: 1 },
    { name: 'Standard', price: 99, count: 2 },
    { name: 'Premium', price: 199, count: 3 },
  ];

  return (
    <div className="plan-cards">
      {plans.map((plan, idx) => (
        <div className="plan-card" key={idx}>
          <h3>{plan.name} Plan</h3>
          <p>₹ {plan.price}</p>
          <p>Can view {plan.count} image(s)</p>
          <button onClick={() => onSubscribe(plan.name)}>Subscribe</button>
        </div>
      ))}
    </div>
  );
}

export default Pack;