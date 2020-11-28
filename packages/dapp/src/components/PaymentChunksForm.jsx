import React from 'react';
import { utils } from 'ethers';

const ProjectChunksForm = ({ context }) => {
  return (
    <section className="payment-chunks-form">
      {Array.from(Array(Number(context.milestones))).map((_val, index) => {
        return (
          <div className="parallel-inputs" key={index}>
            <div className="ordered-inputs">
              <label>Payment {index+1}</label>
              <input
                type="text"
                onChange={e => {
                  const amount = utils.parseEther(e.target.value);
                  const newPayments = context.payments.slice();
                  newPayments[index] = amount;
                  context.setPayments(newPayments);
                }}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default ProjectChunksForm;
