import React from "react";
import StripeCheckout from "react-stripe-checkout";

import axios from "axios";
import STRIPE_PUBLIC_KEY from "../../config/stripekey";
const StripeCheckoutButton = ({ price, paymentSuccessCallback }) => {
  const priceForStripe = price * 100;

  const onToken = (token) => {
    axios
      .post("/api/payment", {
        amount: priceForStripe,
        token,
      })
      .then((response) => {
        //TODO: might want to show a more helpful success message
        paymentSuccessCallback();
        alert(
          "Your payment is successful. We will be in touch through email soon"
        );
      })
      .catch((error) => {
        console.log("Payment Error: ", error);
        //TODO: similar here
        alert(
          "There was an issue with your payment! Please make sure you use the provided credit card."
        );
      });
  };

  return (
    <StripeCheckout
      label="Pay"
      name="Seattle Produce Delivery"
      billingAddress
      shippingAddress
      description={`Your total is $${price}`}
      amount={priceForStripe}
      panelLabel="Pay"
      token={onToken}
      stripeKey={STRIPE_PUBLIC_KEY}
    />
  );
};

export default StripeCheckoutButton;
