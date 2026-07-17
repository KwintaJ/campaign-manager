import { useState, useEffect } from 'react';

function App() {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [towns, setTowns] = useState([]);
  const [allKeywords, setAllKeywords] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingId, setEditingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  // nowy formularz edycji
  const initialFormState = {
    name: '',
    townId: '',
    radius: 10,
    status: 'ON',
    bidAmount: '',
    campaignFund: '',
    selectedKeywords: []
  };
  const [formData, setFormData] = useState(initialFormState);

  const [keywordSearch, setKeywordSearch] = useState('');
  const [showKeywordDropdown, setShowKeywordDropdown] = useState(false);

  const fetchData = () => {
    // pobranie salda
    fetch('http://localhost:8080/api/account/balance')
      .then(async (response) => {
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || 'Błąd pobierania salda');
        }
        return response.json();
      })
      .then((data) => setBalance(data.balance))
      .catch((err) => setError(err.message));

    // pobranie listy kampanii
    fetch('http://localhost:8080/api/campaigns')
      .then(async (response) => {
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || 'Błąd pobierania kampanii');
        }
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
  };

  useEffect(() => {
    fetchData();

    fetch('http://localhost:8080/api/towns')
      .then(res => res.json())
      .then(data => setTowns(data))
      .catch(err => console.error("Błąd pobierania miast", err));

    fetch('http://localhost:8080/api/keywords')
      .then(res => res.json())
      .then(data => setAllKeywords(data))
      .catch(err => console.error("Błąd pobierania słów kluczowych", err));
  }, []);

  // akcje tabeli
  // usuwanie kampanii
  const handleDelete = (id) => {
    if (!window.confirm("Na pewno usunąć?")) return;

    fetch('http://localhost:8080/api/campaigns/' + id, { method: 'DELETE' })
      .then(async (response) => {
        if (response.ok) {
          const msg = await response.text();
          alert(msg);
          fetchData();
        } else {
          const errText = await response.text();
          alert(errText || "Błąd serwera przy usuwaniu.");
        }
      })
      .catch(err => alert("Błąd połączenia: " + err.message));
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setFormData(initialFormState);
    setFormErrors({});
    setApiError(null);
    setIsModalOpen(true);
  };

  // edycja lub stworznie kampanii
  const openEditModal = (id) => {
    setModalMode('edit');
    setEditingId(id);
    setFormErrors({});
    setApiError(null);
    
    fetch('http://localhost:8080/api/campaigns/' + id)
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || "Nie udało się pobrać danych kampanii.");
        }
        return res.json();
      })
      .then(data => {
        setFormData({
          name: data.name || '',
          townId: data.town ? data.town.id : '',
          radius: data.radius || 10,
          status: data.status || 'OFF',
          bidAmount: data.bidAmount || '',
          campaignFund: data.campaignFund || '',
          selectedKeywords: data.keywords || []
        });
        setIsModalOpen(true);
      })
      .catch(err => alert(err.message));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setKeywordSearch('');
    setApiError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: null }));
    if (apiError) setApiError(null); // Czyszczenie błędu API przy edycji
  };

  const toggleStatus = () => {
    setFormData(prev => ({ ...prev, status: prev.status === 'ON' ? 'OFF' : 'ON' }));
  };

  // typeahead
  const handleAddKeyword = (kw) => {
    if (!formData.selectedKeywords.some(k => k.id === kw.id)) {
      setFormData(prev => ({ ...prev, selectedKeywords: [...prev.selectedKeywords, kw] }));
    }
    setKeywordSearch('');
    setShowKeywordDropdown(false);
    if (formErrors.keywords) setFormErrors(prev => ({ ...prev, keywords: null }));
    if (apiError) setApiError(null);
  };

  const handleRemoveKeyword = (id) => {
    setFormData(prev => ({
      ...prev,
      selectedKeywords: prev.selectedKeywords.filter(k => k.id !== id)
    }));
  };

  const filteredKeywords = allKeywords.filter(kw => 
    kw.word && kw.word.toLowerCase().includes(keywordSearch.toLowerCase()) &&
    !formData.selectedKeywords.some(selected => selected.id === kw.id)
  );

  // walidacja i zapis
  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = "Nazwa jest wymagana";
    if (!formData.townId) errors.townId = "Wybierz miasto";
    if (formData.selectedKeywords.length === 0) errors.keywords = "Wybierz min. 1 słowo kluczowe";
    if (!formData.bidAmount || formData.bidAmount <= 0) errors.bidAmount = "Podaj prawidłową stawkę";
    if (!formData.campaignFund || formData.campaignFund <= 0) errors.campaignFund = "Podaj prawidłowy budżet";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: formData.name,
      townId: Number(formData.townId),
      radius: Number(formData.radius),
      status: formData.status,
      bidAmount: Number(formData.bidAmount),
      campaignFund: Number(formData.campaignFund),
      keywordIds: formData.selectedKeywords.map(k => k.id)
    };

    const url = modalMode === 'create' 
      ? 'http://localhost:8080/api/campaigns' 
      : 'http://localhost:8080/api/campaigns/' + editingId;
    const method = modalMode === 'create' ? 'POST' : 'PUT';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async response => {
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || "Błąd podczas zapisu.");
        }
        closeModal();
        fetchData();
      })
      .catch(err => alert("Wystąpił błąd: " + err.message));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              campaign-<span className="text-emerald-600">manager</span>
            </h1>
          </div>
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
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Twoje kampanie reklamowe</h2>
          <button 
            onClick={openCreateModal}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm active:scale-95"
          >
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
                      <button onClick={() => openEditModal(campaign.id)} className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-3">Edytuj</button>
                      <button onClick={() => handleDelete(campaign.id)} className="text-red-600 hover:text-red-800 font-medium text-sm">Usuń</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>

      {/* formularz */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8">
            
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {modalMode === 'create' ? 'Utwórz nową kampanię' : 'Edycja kampanii'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
              
              {/* name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa kampanii</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="np. Wiosenna wyprzedaż"
                  className={"w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none " + (formErrors.name ? "border-red-500" : "border-gray-300")}
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>

              {/* townId, radius */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Miasto bazowe</label>
                  <select 
                    name="townId" value={formData.townId} onChange={handleInputChange}
                    className={"w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none " + (formErrors.townId ? "border-red-500" : "border-gray-300")}
                  >
                    <option value="">-- Wybierz miasto --</option>
                    {towns.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  {formErrors.townId && <p className="text-red-500 text-xs mt-1">{formErrors.townId}</p>}
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Promień zasięgu</label>
                    <span className="text-sm font-bold text-emerald-600">{formData.radius} km</span>
                  </div>
                  <input 
                    type="range" name="radius" min="1" max="100" value={formData.radius} onChange={handleInputChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
                  />
                </div>
              </div>

              {/* keywordIds */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Słowa kluczowe</label>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.selectedKeywords.map(kw => (
                    <span key={kw.id} className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                      {kw.word}
                      <button type="button" onClick={() => handleRemoveKeyword(kw.id)} className="text-emerald-900 hover:text-red-600 font-bold ml-1">&times;</button>
                    </span>
                  ))}
                </div>

                <input 
                  type="text" value={keywordSearch}
                  onChange={(e) => { setKeywordSearch(e.target.value); setShowKeywordDropdown(true); }}
                  onFocus={() => setShowKeywordDropdown(true)}
                  placeholder="Zacznij wpisywać słowo..."
                  className={"w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none " + (formErrors.keywords ? "border-red-500" : "border-gray-300")}
                />
                {formErrors.keywords && <p className="text-red-500 text-xs mt-1">{formErrors.keywords}</p>}

                {showKeywordDropdown && keywordSearch && filteredKeywords.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                    {filteredKeywords.map(kw => (
                      <li key={kw.id} onClick={() => handleAddKeyword(kw)} className="px-4 py-2 hover:bg-emerald-50 cursor-pointer text-sm">
                        {kw.word}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* campaignFund, bidAmount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fundusz Kampanii</label>
                  <input 
                    type="number" step="0.01" name="campaignFund" value={formData.campaignFund} onChange={handleInputChange} placeholder="$"
                    className={"w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none " + (formErrors.campaignFund ? "border-red-500" : "border-gray-300")}
                  />
                  {formErrors.campaignFund && <p className="text-red-500 text-xs mt-1">{formErrors.campaignFund}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stawka (Bid)</label>
                  <input 
                    type="number" step="0.01" name="bidAmount" value={formData.bidAmount} onChange={handleInputChange} placeholder="$"
                    className={"w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none " + (formErrors.bidAmount ? "border-red-500" : "border-gray-300")}
                  />
                  {formErrors.bidAmount && <p className="text-red-500 text-xs mt-1">{formErrors.bidAmount}</p>}
                </div>
              </div>

              {/* status */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div>
                  <span className="block text-sm font-medium text-gray-700">Status kampanii</span>
                </div>
                
                <button 
                  type="button" onClick={toggleStatus}
                  className={"w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none " + (formData.status === 'ON' ? 'bg-emerald-500' : 'bg-gray-300')}
                >
                  <div className={"w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 " + (formData.status === 'ON' ? 'translate-x-7' : 'translate-x-1')}></div>
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition">Anuluj</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-lg transition shadow-sm">
                  {modalMode === 'create' ? 'Utwórz kampanię' : 'Zapisz zmiany'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;