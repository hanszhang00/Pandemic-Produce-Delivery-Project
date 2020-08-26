const express = require("express");
const router = express.Router();

const stripe = require("stripe")(process.env.stripeSecretKey);
router.post("/", function (req, res) {
  const body = {
    source: req.body.token.id,
    amount: req.body.amount + 500,
    currency: "usd",
  };

  stripe.charges.create(body, (stripeErr, stripeRes) => {
    if (stripeErr) {
      res.status(500).send({ error: stripeErr });
    } else {
      res.status(200).send({ success: stripeRes });
    }
  });
});

module.exports = router;
