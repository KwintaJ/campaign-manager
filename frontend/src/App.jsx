import { useState, useEffect } from 'react';

function App() {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // pobranie salda
    fetch('http://localhost:8080/api/account/balance')
      .then((response) => {
        if (!response.ok) throw new Error('Błąd pobierania salda');
        return response.json();
      })
      .then((data) => setBalance(data.balance))
      .catch((err) => setError(err.message));

    // pobranie listy kampanii
    fetch('http://localhost:8080/api/campaigns')
      .then((response) => {
        if (!response.ok) throw new Error('Błąd pobierania kampanii');
        return response.json();
      })
      .then((data) => {
        setCampaigns(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Błąd kampanii:", err);
        setIsLoading(false);
      });
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
                {error ? 'Błąd' : balance !== null ? balance?.toFixed(2) : 'Ładowanie...'}
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

        {/* kampanie: loading / stan pusty / tabela */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-500 animate-pulse">
            Ładowanie kampanii...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Brak aktywnych kampanii</h3>
            <p className="text-gray-500 max-w-sm">
              Nie masz jeszcze żadnych kampanii reklamowych.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-200 text-sm uppercase text-gray-500 font-semibold">
                <tr>
                  <th className="py-4 px-6">Nazwa kampanii</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Miasto (Promień)</th>
                  <th className="py-4 px-6">Słowa kluczowe</th>
                  <th className="py-4 px-6 text-right">Budżet</th>
                  <th className="py-4 px-6 text-center">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {campaign.name}
                    </td>
                    <td className="py-4 px-6">
                      <span className={
                        "px-2.5 py-1 rounded-full text-xs font-bold " + 
                        (campaign.status === 'ON' ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600")
                      }>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <span className="font-medium text-gray-800">{campaign.town.name}</span>
                      <span className="text-gray-400 ml-1">({campaign.radius} km)</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {campaign.keywords?.map(kw => (
                          <span key={kw.id} className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-xs">
                            {kw.word}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="font-bold text-gray-900">{campaign.campaignFund?.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">Stawka: {campaign.bidAmount?.toFixed(2)}</div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-3">Edytuj</button>
                      <button className="text-red-600 hover:text-red-800 font-medium text-sm">Usuń</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>

    </div>
  );
}

export default App;