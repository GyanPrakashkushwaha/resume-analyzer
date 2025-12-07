import { useState } from 'react';
import FileUploader from "./components/FileUploader";
import Navbar from "./components/Navbar";

function App() {
  const [file, setFile] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto mt-20 p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Component Test Zone</h2>
        
        {/* Test the FileUploader */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <FileUploader onFileSelect={(f) => setFile(f)} />
        </div>

        {/* Debug Output */}
        <div className="mt-8 text-center text-gray-500">
            {file ? (
                <p>✅ Selected file: {file.name}</p>
            ) : (
                <p>Waiting for file...</p>
            )}
        </div>
      </div>
    </div>
  );
}

export default App;