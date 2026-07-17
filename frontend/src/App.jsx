import { useState, useEffect } from 'react';

function App() {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // pobranie salda
    fetch('http://localhost:8080/api/account/balance')
      .then((response) => {
        if (!response.ok) throw new Error('Błąd pobierania salda');
        return response.json();
      })
      .then((data) => setBalance(data.balance))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* tytul */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              campaign-<span className="text-emerald-600">manager</span>
            </h1>
          </div>

          {/* portfel */}
          <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 shadow-inner">
            <span className="text-xl" title="dollars">$</span>
            <div className="flex flex-col">
              <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wider -mb-1">
                Saldo konta
              </span>
              <span className="font-bold text-emerald-900">
                {error ? 'Błąd' : balance !== null ? `${balance.toFixed(2)}` : 'Ładowanie...'}
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* naglowek i button na nowa kampanie */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Twoje kampanie reklamowe</h2>
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm active:scale-95">
            + Utwórz kampanię
          </button>
        </div>

        {/* stan pusty */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Brak aktywnych kampanii</h3>
          <p className="text-gray-500 max-w-sm">
            Nie masz jeszcze żadnych kampanii reklamowych.
          </p>
        </div>

      </main>

    </div>
  );
}

export default App;