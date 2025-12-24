import { useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message || !file) {
      setStatus("Please enter message and upload Excel file ❌");
      return;
    }

    const formData = new FormData();
    formData.append("message", message);
    formData.append("file", file);

    try {
      setLoading(true);
      setStatus("");

      const res = await axios.post(
        "https://bulkmail-new-1.onrender.com/sendemail",
        formData
      );

      setStatus(res.data.message || "Emails sent successfully ✅");
      setMessage("");
      setFile(null);
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to send emails ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-indigo-900 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-indigo-700">
          📧 Bulk Mail App
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Send bulk emails using Excel file
        </p>

        <hr className="my-6" />

        {/* Message Box */}
        <textarea
          className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
          placeholder="Enter your email message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* File Upload */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Excel File
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-700
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
          {file && (
            <p className="text-sm text-green-600 mt-2">
              Selected: {file.name}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Emails"}
        </button>

        {/* Status */}
        {status && (
          <p className="text-center text-sm mt-4 font-medium text-gray-700">
            {status}
          </p>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by Node.js • Gmail • MongoDB
        </p>
      </div>
    </div>
  );
}

export default App;
