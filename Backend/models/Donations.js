// Step 1: Import mongoose
const mongoose = require('mongoose');

// Step 2: Define donation schema
const donationSchema = new mongoose.Schema(
  {
    // Who donated
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Which NGO
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NGO',
      required: true
    },

    // Amount
    amount: {
      type: Number,
      required: [true, 'Please provide donation amount'],
      min: [10, 'Minimum donation amount is ₹10']
    },

    // Currency
    currency: {
      type: String,
      default: 'INR'
    },

    // Payment Details
    paymentDetails: {
      orderId: String,           // Razorpay order ID
      paymentId: String,         // Razorpay payment ID
      signature: String,         // Razorpay signature (for verification)
      method: String,            // UPI, Card, NetBanking, etc.
      status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
      }
    },

    // Tax Receipt
    taxReceipt: {
      receiptNumber: String,     // Unique receipt number
      receiptUrl: String,        // PDF download link
      section80G: {
        type: Boolean,
        default: true
      },
      generatedAt: Date
    },

    // Anonymous Donation
    isAnonymous: {
      type: Boolean,
      default: false
    },

    // Optional Message
    message: {
      type: String,
      maxlength: [500, 'Message cannot exceed 500 characters']
    }
  },
  {
    timestamps: true
  }
);


//Generate unique receipt number before saving
donationSchema.pre('save', async function(next) {
  // Only generate if payment successful and no receipt yet
  if (this.paymentDetails.status === 'success' && !this.taxReceipt.receiptNumber) {
    // Generate receipt number: REC-YYYYMMDD-XXXXX
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Get count of donations today for unique number
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      }
    });
    
    this.taxReceipt.receiptNumber = `REC-${year}${month}${day}-${String(count + 1).padStart(5, '0')}`;
    this.taxReceipt.generatedAt = Date.now();
  }
  
  next();
});


const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;