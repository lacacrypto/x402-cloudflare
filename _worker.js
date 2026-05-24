export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const payTo = env.PAY_TO || "0x970c7e8e0e366e817264aa2aa3634622d4eeaddb";

    if (url.pathname === "/pay" || url.pathname === "/api/premium") {
      return new Response(
        JSON.stringify({ message: "Payment Required" }),
        {
          status: 402,
          headers: {
            "Content-Type": "application/json",
            "x402-payment-required": JSON.stringify({
              accepts: [{
                scheme: "exact",
                price: "$0.1",
                network: "eip155:8453",
                payTo: payTo,
                description: "Mở khóa nội dung premium"
              }]
            })
          }
        }
      );
    }

    // Trang chủ
    return new Response(`
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>x402 Payment</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-950 text-white min-h-screen flex items-center justify-center p-4">
        <div class="max-w-md w-full bg-gray-900 rounded-3xl p-10 text-center">
          <h1 class="text-4xl font-bold mb-2">🔐 x402 Payment</h1>
          <p class="text-gray-400 mb-8">Thanh toán USDC trên Base</p>
          
          <div class="bg-gray-800 rounded-2xl p-6 mb-8">
            <p class="text-gray-400">Nội dung Premium</p>
            <p class="text-4xl font-bold text-green-400 mt-1">$0.1 USDC</p>
          </div>

          <button onclick="pay()" class="w-full bg-blue-600 hover:bg-blue-700 py-5 rounded-2xl text-xl font-medium">
            Mở khóa ngay bằng x402
          </button>
        </div>

        <script>
          async function pay() {
            try {
              const res = await fetch('/pay');
              if (res.status === 402) {
                // Trigger mạnh nhất cho Coinbase Wallet
                window.location.href = '/pay';
              }
            } catch(e) {}
          }
        </script>
      </body>
      </html>
    `, { headers: { "Content-Type": "text/html" } });
  }
}
