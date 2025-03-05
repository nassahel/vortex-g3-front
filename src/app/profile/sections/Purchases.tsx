import React, { useState } from 'react'

type Props = {
  purchases: any;
}

interface Purchase {
  id: string;
  status: string;
  price: number;
  userId: string;
  createdAt: string;
}

const getInvoice = async (id: string, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No se encontró el token en el localStorage');
    return;
  }

  try {
    setLoading(true); // Activar el loader mientras descargamos el archivo
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'report/generate-invoice/' + id, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener factura');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `factura-${id}.pdf`;
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    setLoading(false); // Desactivar el loader después de intentar descargar el archivo
  }
};

const Purchases = ({ purchases }: Props) => {
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <div>
        {purchases && purchases.map((item: Purchase, i: number) => (
          <div key={i} className="bg-white border border-gray-300 rounded-lg p-5 mb-5 shadow-sm space-y-4">
            {/* Título: Código de compra */}
            <div className="border-b border-gray-200 pb-2">
              <p className="text-sm font-semibold text-gray-800">
                Código de compra: <span className="font-normal">{item.id.slice(0, 7)}</span>
              </p>
            </div>

            {/* Lista de productos */}
            <div className="space-y-3">
              {item.items.map((prod, j) => (
                <div key={j} className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-gray-800">{prod.product.name}</p>
                    <p className="text-xs text-gray-500">Cantidad: {prod.quantity}</p>
                  </div>
                  <p className="text-sm text-gray-600">${prod.product.price}</p>
                </div>
              ))}
            </div>

            {/* Resumen total y estado */}
            <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
              <p className="text-sm font-semibold text-gray-800">
                Total: <span className="font-normal">${item.price}</span>
              </p>
              <p className="text-sm font-medium text-gray-700">
                Estado: <span className="font-semibold text-gray-800">
                  {item.status == 'INPROCESS' ? 'En Proceso' :
                    item.status == 'PENDING' ? 'Pendiente' :
                      item.status == 'COMPLETED' ? 'Completada' :
                        'Cancelada'}
                </span>
              </p>
            </div>

            {/* Botón de descargar factura */}
            <div className="pt-3">
              <button
                className="w-full bg-gray-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-gray-700 transition"
                onClick={() => { getInvoice(item.id, setLoading) }}
                disabled={loading} // Deshabilitar el botón mientras se está descargando
              >
                {loading ? 'Cargando...' : 'Descargar factura de compra'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Purchases;
