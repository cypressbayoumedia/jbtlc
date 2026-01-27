
import { setGlobalOptions } from "firebase-functions/v2";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import Stripe from "stripe";


setGlobalOptions({ maxInstances: 10 });

// Initialize Stripe with your Secret Key (use environment variables in production)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_51SuAccCfpoAwBajMFoSbIM6QyIzo1s0FHTqRrsAsCKlsCl28wCrZYZehjy8lxTsf78EXuwM3LG6PVOcEYhBvvdsS00d8gtTaxw", {
    apiVersion: "2025-12-15.clover", // Updated to match installed types
});

// Cloud Function to create a PaymentIntent
export const createPaymentIntent = onCall(async (request) => {
    // 1. Validation
    const amount = request.data.amount;
    const currency = request.data.currency || "usd";
    const { customerName, customerEmail } = request.data;

    // Minimum $15.00 (1500 cents) validation
    if (!amount || typeof amount !== "number" || amount < 1500) {
        throw new HttpsError("invalid-argument", "The amount must be at least $15.00.");
    }

    try {
        let customerId;

        // Optional: Create or retrieve a Stripe Customer purely for tracking
        // This links the transaction to a "person" in the Stripe Dashboard
        if (customerEmail) {
            const existingCustomers = await stripe.customers.list({ email: customerEmail, limit: 1 });
            if (existingCustomers.data.length > 0) {
                customerId = existingCustomers.data[0].id;
            } else {
                const newCustomer = await stripe.customers.create({
                    email: customerEmail,
                    name: customerName,
                });
                customerId = newCustomer.id;
            }
        }

        // 2. Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount), // Ensure integer (cents)
            currency: currency,
            customer: customerId, // Link to customer if found/created
            metadata: {
                customerName: customerName || 'Walk-in',
                customerEmail: customerEmail || 'N/A',
            },
            automatic_payment_methods: {
                enabled: true,
            },
            receipt_email: customerEmail, // Stripe will email the receipt automatically if live mode
        });

        // 3. Return clientSecret to the client
        return {
            clientSecret: paymentIntent.client_secret,
        };
    } catch (error: any) {
        console.error("Stripe Error:", error);
        throw new HttpsError("internal", error.message || "An error occurred while creating the PaymentIntent.");
    }
});
