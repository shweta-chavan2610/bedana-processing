import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Copy, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(searchParams.get("amount") || "");
  const [name, setName] = useState("");
  const [txnId, setTxnId] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  const upiId = "shwetachavan2610@okicici";
  const whatsappNumber = "917822048308";

  const copyUPI = () => {
    navigator.clipboard.writeText(upiId);
    toast.success("UPI ID copied to clipboard");
  };

  const handleIHavePaid = () => {
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      toast.error("Please enter a valid payment amount greater than 0.");
      return;
    }
    setShowModal(true);
  };

  const handleConfirm = () => {
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      toast.error("Invalid payment amount");
      return;
    }

    if (txnId.length !== 12) {
      toast.error("Please enter the 12-digit Transaction ID (UTR/RRN)");
      return;
    }

    const message = `Hello,
I have completed the payment.

Name: ${name || "Customer"}
Amount: ₹${amount}
Transaction ID (UTR): ${txnId}

Please confirm my order.`;

    const encodedMessage = encodeURIComponent(message);
    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-card p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
        <button 
          onClick={() => navigate("/")}
          className="absolute left-6 top-8 text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <h1 className="text-2xl font-display font-bold text-foreground text-center mb-2 mt-8 md:mt-0">
          Complete Your Payment
        </h1>
        <p className="text-muted-foreground text-sm text-center mb-8">
          Enter amount and pay via UPI
        </p>

        <div className="bg-[#6b4caf10] p-6 rounded-xl mb-6 flex flex-col items-center">
          <div className="w-48 h-48 bg-white rounded-lg p-2 border border-border overflow-hidden mb-4">
            <img 
              src="/qr-code.png" 
              alt="Scan to Pay" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center gap-1 text-[#6b4caf]">
            <span className="text-3xl font-bold">₹</span>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-transparent text-3xl font-bold w-32 outline-none border-b-2 border-[#6b4caf20] focus:border-[#6b4caf] transition-colors"
            />
          </div>
        </div>

        <div className="bg-muted p-3 rounded-lg flex items-center justify-between mb-8 border border-dashed border-muted-foreground/30">
          <span className="text-sm font-medium text-foreground truncate mr-2">
            {upiId}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={copyUPI}
            className="text-[#6b4caf] hover:bg-[#6b4caf] hover:text-white transition-colors h-8"
          >
            <Copy size={16} className="mr-1" /> Copy
          </Button>
        </div>

        <div className="space-y-4 mb-8">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground ml-1">Payment Amount</label>
            <input
              type="number"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-[#6b4caf] outline-none transition-all font-bold text-[#6b4caf]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground ml-1">Your Name</label>
            <input
              type="text"
              placeholder="Name (Optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-[#6b4caf] outline-none transition-all"
            />
          </div>
          <Button 
            className="w-full bg-[#6b4caf] hover:bg-[#5a3f96] text-white py-6 text-lg font-semibold rounded-xl shadow-lg shadow-[#6b4caf15] transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            onClick={handleIHavePaid}
            disabled={!parseFloat(amount) || parseFloat(amount) <= 0}
          >
            I Have Paid <CheckCircle2 size={20} className="ml-2" />
          </Button>
        </div>

        <div className="text-center space-y-2">
          <p className="text-destructive text-xs font-semibold">
            Orders are verified before confirmation
          </p>
          <p className="text-muted-foreground text-[10px]">
            Powered by Riddhi Siddhi Payment Verification
          </p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <h2 className="text-xl font-bold mb-2">Payment Verification</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Enter 12-digit Transaction ID (UTR/RRN)
            </p>
            <input
              type="text"
              maxLength={12}
              placeholder="123456789012"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value.replace(/\D/g, ""))}
              className="w-full text-center text-xl tracking-[0.2em] font-bold p-4 border-2 rounded-xl mb-6 focus:border-[#6b4caf] outline-none transition-all"
            />
            <div className="space-y-3">
              <Button 
                onClick={handleConfirm}
                className="w-full bg-[#6b4caf] hover:bg-[#5a3f96] text-white font-bold h-12 rounded-xl"
              >
                Confirm Payment
              </Button>
              <button 
                onClick={() => setShowModal(false)}
                className="text-sm text-muted-foreground font-medium hover:text-foreground transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
