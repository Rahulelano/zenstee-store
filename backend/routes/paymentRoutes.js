import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import Order from '../models/Order.js';

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Public
router.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body; // Amount in smallest currency unit (paise)

        if (!amount) {
            return res.status(400).json({ message: 'Amount is required' });
        }

        const options = {
            amount: amount,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        res.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
            key: process.env.RAZORPAY_KEY_ID // Send key to frontend
        });

    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500).json({ message: 'Server Error during payment initiation', error: error.message });
    }
});

// @desc    Verify Payment Signature AND Save Order
// @route   POST /api/payment/verify
router.post('/verify', async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            customerDetails,
            amount,
            items
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // 1. Payment Success - Save Order to DB
            let savedOrder;
            try {
                // Determine order items (handle both single product & cart items if passed differently)
                // The frontend now passes 'items' array which matches our schema structure closely
                // or we adapt it.

                const orderItems = items ? items.map(item => ({
                    name: item.name,
                    quantity: item.quantity || 1,
                    image: item.image,
                    price: item.price,
                    size: item.size,
                    productId: item._id || item.id || item.productId
                })) : [];

                const order = new Order({
                    customerDetails,
                    orderItems,
                    paymentInfo: {
                        id: razorpay_payment_id,
                        status: 'Captured' // Razorpay auto-captures by default
                    },
                    totalAmount: amount ? amount / 100 : 0, // Convert poise to rupees
                    status: 'Paid'
                });

                savedOrder = await order.save();
                console.log("Order saved to DB:", savedOrder._id);

            } catch (dbError) {
                console.error("Failed to save order to DB:", dbError);
                // We should still consider payment success, but log this critical error
            }


            // 2. Send Email Notifications
            if (customerDetails) {
                const itemsHtml = items ? items.map(item => `
                    <li>
                        <strong>${item.name}</strong> (${item.size}) x ${item.quantity || 1} - ₹${item.price}
                    </li>
                 `).join('') : '<li>Product details not available</li>';

                const commonMessage = `
                    <p><strong>Order ID:</strong> ${savedOrder ? savedOrder._id : 'Pending'}</p>
                    <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
                    <p><strong>Amount:</strong> ₹${amount ? amount / 100 : 'N/A'}</p>
                    <h3>Items:</h3>
                    <ul>${itemsHtml}</ul>
                    <h3>Customer Details:</h3>
                    <p><strong>Name:</strong> ${customerDetails.name}</p>
                    <p><strong>Email:</strong> ${customerDetails.email}</p>
                    <p><strong>Phone:</strong> ${customerDetails.phone}</p>
                    <p><strong>Address:</strong> ${customerDetails.address}</p>
                 `;

                // A. Admin Email
                const adminMessage = `<h1>New Order Received!</h1>` + commonMessage;
                try {
                    await sendEmail({
                        email: 'zenstee@gmail.com',
                        subject: `New Order from ${customerDetails.name}`,
                        html: adminMessage,
                        message: `New Order from ${customerDetails.name}`
                    });
                    console.log("Admin email sent");
                } catch (emailError) {
                    console.error("Failed to send admin email:", emailError);
                }

                // B. Customer Email
                const customerMessage = `
                    <h1>Order Confirmed!</h1>
                    <p>Hi ${customerDetails.name},</p>
                    <p>Thank you for your order. We have received your payment.</p>
                    ${commonMessage}
                    <p>We will notify you once your order is shipped.</p>
                    <p>Thanks,<br>Team Zenstee</p>
                 `;
                try {
                    await sendEmail({
                        email: customerDetails.email,
                        subject: `Order Confirmation - Zenstee`,
                        html: customerMessage,
                        message: `Your order has been confirmed.`
                    });
                    console.log("Customer email sent");
                } catch (emailError) {
                    console.error("Failed to send customer email:", emailError);
                }
            }

            res.json({ status: 'success', message: 'Payment verified and Order Saved' });
        } else {
            res.status(400).json({ status: 'failure', message: 'Invalid signature' });
        }
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
