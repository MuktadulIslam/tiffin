// Bengali translation & number utilities for the user-facing store
// Admin panel is intentionally excluded.

const EN_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Convert all ASCII digits in a string to Bengali digits */
export function toBnDigits(s: string | number): string {
  return String(s).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

/** Convert Bengali digits back to ASCII (for input onChange) */
export function fromBnDigits(s: string): string {
  return s.replace(/[০-৯]/g, (d) => String(EN_DIGITS.indexOf(d) === -1 ? d : BN_DIGITS.indexOf(d)));
}

/** Format price with Bengali currency symbol + Bengali digits */
export function fmtBn(n: number): string {
  return "৳" + toBnDigits(n.toLocaleString("en-BD"));
}

export const translations: Record<string, string> = {
  // Nav
  "Back to Store": "স্টোরে ফিরুন",
  "Back": "ফিরুন",
  "Cart": "কার্ট",
  "Biology Books": "জীববিজ্ঞান বই",

  // Home page
  "Price": "মূল্য",
  "View Details →": "বিস্তারিত দেখুন →",
  "Browse Books": "বই দেখুন",
  "pages": "পৃষ্ঠা",
  "rating": "রেটিং",
  "save": "সাশ্রয়",
  "off": "ছাড়",
  "No books available at the moment.": "এই মুহূর্তে কোনো বই নেই।",

  // Book list page
  "All Titles": "সব বই",
  "Curated collection of": "বাছাই করা সংগ্রহ",
  "top-rated titles": "শীর্ষ রেটেড বই",
  "Titles": "বই",
  "Avg Rating": "গড় রেটিং",
  "Discounts": "ছাড়",
  "Up to": "সর্বোচ্চ",
  "No books available yet.": "এখনো কোনো বই নেই।",
  "by": "লিখেছেন",
  "+ Add to Cart": "+ কার্টে যোগ করুন",
  "View →": "দেখুন →",

  // SingleBook tabs & labels
  "about": "বিবরণ",
  "chapters": "অধ্যায়",
  "details": "বিস্তারিত",
  "Total Pages": "মোট পৃষ্ঠা",
  "Rating": "রেটিং",
  "Total Chapters": "মোট অধ্যায়",
  "Author": "লেখক",
  "Publication": "প্রকাশনী",
  "Edition": "সংস্করণ",
  "Version": "ভার্সন",
  "Regular Price": "নিয়মিত মূল্য",
  "Discount Price": "ছাড়ের মূল্য",
  "You Save": "আপনার সাশ্রয়",
  "Tag": "ট্যাগ",
  "No chapters listed for this book.": "এই বইয়ের কোনো অধ্যায় নেই।",
  "Add to Cart": "কার্টে যোগ করুন",
  "Added — Add More": "আরো যোগ করুন",

  // Checkout
  "Order Summary": "অর্ডার সারসংক্ষেপ",
  "No items yet": "এখনো কিছু নেই",
  "Subtotal": "মোট",
  "Shipping": "ডেলিভারি চার্জ",
  "Total": "সর্বমোট",
  "Free shipping on orders above ৳3,000": "৳৩,০০০ এর উপরে অর্ডারে ফ্রি ডেলিভারি",
  "Info": "তথ্য",
  "Payment": "পেমেন্ট",
  "Confirm": "নিশ্চিত করুন",
  "Your Cart": "আপনার কার্ট",
  "Your cart is empty": "আপনার কার্ট খালি",
  "Qty:": "পরিমাণ:",
  "Remove": "রিমুভ করুন",
  "Proceed to Delivery Info →": "ডেলিভারি তথ্যে যান →",
  "Delivery Information": "ডেলিভারি তথ্য",
  "Full Name": "পূর্ণ নাম",
  "Phone Number": "ফোন নম্বর",
  "City": "শহর",
  "Full Address": "সম্পূর্ণ ঠিকানা",
  "Order Note (Optional)": "অর্ডার নোট (ঐচ্ছিক)",
  "Your full name": "আপনার পুরো নাম",
  "House, Road, Area...": "বাড়ি, রাস্তা, এলাকা...",
  "Any special instructions": "কোনো বিশেষ নির্দেশনা",
  "← Back": "← ফিরে যান",
  "Proceed to Payment →": "পেমেন্টে যান →",
  "Payment Method": "পেমেন্ট পদ্ধতি",
  "Cash on Delivery": "ক্যাশ অন ডেলিভারি",
  "Pay in cash when your books arrive at your door": "বই পৌঁছালে নগদে পরিশোধ করুন",
  "bKash Mobile Banking": "বিকাশ মোবাইল ব্যাংকিং",
  "Bangladesh's #1 mobile payment platform": "বাংলাদেশের ১ নম্বর মোবাইল পেমেন্ট",
  "Send Payment To": "পেমেন্ট পাঠান",
  "Send": "পাঠান",
  "to the number above via bKash app, then fill in the details below to confirm your order.": "উপরের নম্বরে বিকাশে পেমেন্ট করুন, তারপর নিচের তথ্য পূরণ করুন।",
  "Your bKash Number": "আপনার বিকাশ নম্বর",
  "Transaction ID (TrxID)": "ট্রানজেকশন আইডি",
  "Review Order →": "অর্ডার রিভিউ করুন →",
  "Review & Confirm": "পর্যালোচনা ও নিশ্চিত করুন",
  "Delivery To": "ডেলিভারি পাঠান",
  "Books Ordered": "অর্ডার করা বই",
  "Note:": "নোট:",
  "From:": "থেকে:",
  "Order Placed!": "অর্ডার হয়েছে!",
  "Thank you,": "ধন্যবাদ,",
  "! Your books will arrive soon. Happy reading!": "! আপনার বই শীঘ্রই পৌঁছাবে। শুভ পাঠ!",
  "Biology Enthusiast": "জীববিজ্ঞানপ্রেমী",
  "bKash Payment Confirmed": "বিকাশ পেমেন্ট নিশ্চিত",
  "TrxID:": "ট্রানজেকশন আইডি:",
  "Amount:": "পরিমাণ:",
  "Continue Shopping →": "কেনাকাটা চালিয়ে যান →",
  "— Checkout": " — চেকআউট",
  "Buy Now": "অর্ডার করুন",
  "✓ Place Order":"✓ কনফার্ম করুন",
  "Mobile Banking": "মোবাইল ব্যাংকিং",
  "Pay via bKash or Nagad": "বিকাশ বা নগদে পেমেন্ট করুন",
  "to the number above via": "উপরের নম্বরে",
  "app, then enter your Transaction ID below.": "অ্যাপে পাঠান, তারপর নিচে ট্রানজেকশন আইডি দিন।",
  "Your": "আপনার",
  "Number": "নম্বর",
  "Nagad Payment Confirmed": "নগদ পেমেন্ট নিশ্চিত"
};

export function tr(key: string): string {
  return translations[key] ?? key;
}
