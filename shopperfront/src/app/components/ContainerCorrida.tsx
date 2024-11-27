import React from 'react';
import { Option, RideResponseFromUserRequest, FinalRideResponse } from '../interface';
import axios from 'axios';

interface ContainerCorridaProps {
  infoFromApi: RideResponseFromUserRequest;
  driver: Option;
  onConfirm: (customerId: string) => void;
}

function ContainerCorrida({ infoFromApi, driver, onConfirm }: ContainerCorridaProps) {
  const handleConfirmarCorrida = async () => {
    const bodyRide: FinalRideResponse = {
      customer_id: infoFromApi.customer_id,
      origin: infoFromApi.originString,
      destination: infoFromApi.destinationString,
      distance: infoFromApi.distance,
      duration: infoFromApi.duration,
      driver: { id: driver.id, name: driver.name },
      value: driver.price,
    };

    try {
      await axios.patch("http://localhost:8080/ride/confirm", bodyRide, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      onConfirm(infoFromApi.customer_id);
    } catch (error: any) {
      console.error("Erro ao confirmar a corrida", error);
    }
  };

  return (
    <div key={driver.id} className="p-4 bg-gray-100 rounded-lg shadow-sm mb-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{driver.name}</h2>
        <p className="text-gray-500 text-sm mb-4">{driver.description}</p>

        <div className="flex items-center mb-3">
          <span className="font-medium text-gray-700 text-sm">Carro:</span>
          <p className="ml-2 text-gray-600 text-sm">{driver.vehicle}</p>
        </div>

        <div className="flex items-center mb-3">
          <span className="font-medium text-gray-700 text-sm">Distância:</span>
          <p className="ml-2 text-gray-600 text-sm">{infoFromApi.distance.toFixed(0)} KM</p>
        </div>

        <div className="flex items-center mb-3">
          <span className="font-medium text-gray-700 text-sm">Duração:</span>
          <p className="ml-2 text-gray-600 text-sm">{infoFromApi.duration} Minutos</p>
        </div>

        <div className="flex items-center mb-3">
          <span className="font-medium text-gray-700 text-sm">Avaliação:</span>
          <p className="ml-2 text-gray-600 text-sm italic">"{driver.review.comment}"</p>
        </div>

        <div className="flex items-center mb-3">
          <span className="font-medium text-gray-700 text-sm">Nota:</span>
          <p className="ml-2 text-gray-600 text-sm">{driver.review.rating}</p>
        </div>

        <div className="flex items-center mb-3">
          <span className="font-medium text-gray-700 text-sm">Preço:</span>
          <p className="ml-2 text-gray-600 text-sm">R$ {driver.price}</p>
        </div>
      </div>
      <button
        onClick={handleConfirmarCorrida}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
      >
        Escolher
      </button>
    </div>
  );
}

export default ContainerCorrida;
