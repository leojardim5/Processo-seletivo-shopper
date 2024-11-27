'use client';
import { useState } from "react";
import axios from 'axios';
import { RideResponseFromUserRequest, EstimateRequest, Option } from "./interface";
import ContainerCorrida from "./components/ContainerCorrida";

const MainPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [infoFromApi, setInfoFromApi] = useState<RideResponseFromUserRequest | undefined>(undefined);
  const [view, setView] = useState<"estimate" | "history">("estimate");
  const [history, setHistory] = useState<any[]>([]);
  const [filterUserId, setFilterUserId] = useState<string>(""); 
  const [filterDriver, setFilterDriver] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);

  const handleEstimate = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const customer_id = formData.get("userId") as string;
    const origin = formData.get("origin") as string;
    const destination = formData.get("destination") as string;

    const body: EstimateRequest = { customer_id, origin, destination };
    setError(null);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8080/ride/estimate", body, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setInfoFromApi(response.data);
    } catch (error: any) {
      setError("Erro ao estimar a viagem. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchHistory = async (): Promise<void> => {
    setError(null);
    setLoading(true);
    try {
      const query = filterDriver === "all" ? "" : `?driver_id=${filterDriver}`;
      const response = await axios.get(`http://localhost:8080/ride/${filterUserId}${query}`);
      setHistory(response.data.rides || []);
    } catch (error: any) {
      setError("Erro ao buscar histórico. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRide = async (customerId: string): Promise<void> => {
    setView("history");
    setFilterUserId(customerId);
    await handleSearchHistory(); 
  };

  return (
    <div className="min-h-screen grid grid-cols-4">
      <div className="col-span-1 bg-gray-800 text-white flex flex-col items-center py-8 space-y-4">
        <div className="text-center mb-6">
          <h1 className="font-bold text-2xl">Shopper Ride</h1>
          <h2 className="text-green-500 font-bold text-lg">.com</h2>
        </div>
        <button
          className={`w-3/4 py-3 rounded-lg ${view === "estimate" ? "bg-green-500" : "bg-gray-700"} hover:bg-green-600`}
          onClick={() => setView("estimate")}
        >
          Estimar Viagem
        </button>
        <button
          className={`w-3/4 py-3 rounded-lg ${view === "history" ? "bg-green-500" : "bg-gray-700"} hover:bg-green-600`}
          onClick={() => {
            setView("history");
            
          }}
        >
          Histórico de Viagens
        </button>
      </div>

      <div className="col-span-3 bg-green-500 flex items-center justify-center">
        {view === "estimate" ? (
          <div className="bg-gradient-to-b  from-white to-gray-100 shadow-xl rounded-3xl p-8 w-full max-w-lg">
            {infoFromApi === undefined ? (
              <form className="space-y-6" onSubmit={handleEstimate}>
                <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">Solicite sua Viagem</h1>
                {error && <div className="bg-red-100 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>}
                <div className="relative">
                  <input type="text" placeholder="ID do Usuário" name="userId" className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm" />
                </div>
                <div className="relative">
                  <input type="text" placeholder="Endereço de Origem" name="origin" className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm" />
                </div>
                <div className="relative">
                  <input type="text" placeholder="Endereço de Destino" name="destination" className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm" />
                </div>
                <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg">Estimar Viagem</button>
              </form>
            ) : loading ? (
              <p className="text-center text-white">Carregando...</p>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">Motoristas Disponíveis</h1>
                
                <div className="h-96 overflow-y-auto">
                  {infoFromApi.options?.length > 0 ? (
                    infoFromApi.options.map((ride: Option) => (
                      <ContainerCorrida
                        key={ride.id}
                        infoFromApi={infoFromApi}
                        driver={ride}
                        onConfirm={handleConfirmRide}
                      />
                    ))
                  ) : (
                    <p className="text-gray-600 text-center">Nenhum motorista disponível no momento.</p>
                  )}
                  
                </div>
                <button
                  onClick={() => setInfoFromApi(undefined)}
                  className="mt-4 px-4 py-2 bg-gray-500 text-white flex justify-center rounded-lg shadow-md hover:bg-gray-600"
                >
                  Voltar para a Pesquisa
                </button>
              </>
              
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-b from-white to-gray-100 shadow-xl rounded-3xl p-8 w-full max-w-lg">
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">Histórico de Viagens</h1>
            <div className="space-y-4">
              {error && <div className="bg-red-100 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>}
              <div className="relative">
                <input
                  type="text"
                  placeholder="ID do Usuário"
                  value={filterUserId}
                  onChange={(e) => setFilterUserId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm"
                />
              </div>
              <div className="relative">
                <select
                  value={filterDriver}
                  onChange={(e) => setFilterDriver(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm"
                >
                  <option  value="all">Todos os Motoristas</option>
                </select>
              </div>
              <button onClick={handleSearchHistory} className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg">
                Buscar Histórico
              </button>
            </div>
            <div className="h-96 overflow-y-auto mt-4">
              {loading ? (
                <p className="text-center text-white">Carregando...</p>
              ) : history.length > 0 ? (
                history.map((ride, index) => (
                  <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-sm mb-4">
                    <p className="text-gray-700">
                      <strong>Data:</strong> {ride.date}
                    </p>
                    <p className="text-gray-700">
                      <strong>Motorista:</strong> {ride.driver.name}
                    </p>
                    <p className="text-gray-700">
                      <strong>Origem:</strong> {ride.origin}
                    </p>
                    <p className="text-gray-700">
                      <strong>Destino:</strong> {ride.destination}
                    </p>
                    <p className="text-gray-700">
                      <strong>Distância:</strong> {ride.distance.toFixed(2)} km
                    </p>
                    <p className="text-gray-700">
                      <strong>Valor:</strong> R$ {ride.value.toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center">Nenhuma corrida encontrada para este cliente.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
