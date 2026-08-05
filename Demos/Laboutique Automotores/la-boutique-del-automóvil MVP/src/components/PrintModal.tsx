import React from 'react';
import { X, Printer, FileText, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import {
  OrdenTrabajo,
  Presupuesto,
  Recibo,
  Cliente,
  Vehiculo
} from '../types';
import { formatPesos, formatFecha } from '../utils/calculations';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'remito' | 'presupuesto' | 'recibo';
  data: {
    remito?: OrdenTrabajo;
    presupuesto?: Presupuesto;
    recibo?: Recibo;
    cliente?: Cliente;
    vehiculo?: Vehiculo;
    pagoNota?: string;
  };
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  documentType,
  data
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const { remito, presupuesto, recibo, cliente, vehiculo } = data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white text-zinc-900 rounded-xl shadow-2xl max-w-3xl w-full my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Control Header (Non-printable) */}
        <div className="p-4 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800 print:hidden">
          <div className="flex items-center gap-2 font-medium text-sm">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>Vista Previa e Impresión de Documento</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg flex items-center gap-2 text-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Imprimir Documento
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-8 overflow-y-auto print:p-0 print:overflow-visible text-sm font-sans" id="printable-document">
          {/* Document Header */}
          <div className="border-b-2 border-zinc-900 pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <BrandLogo variant="dark" size="md" showSubtext={true} />
                <div className="mt-2 text-xs text-zinc-600 font-medium space-y-0.5">
                  <p>Gral. Deheza 191 — Laboulaye (6120), Córdoba</p>
                  <p>Tel/WhatsApp: (03385) 15-601234 / 421980</p>
                  <p>Condición IVA: Responsable Inscripto</p>
                </div>
              </div>

              <div className="text-right border-l-2 border-zinc-200 pl-6">
                <div className="inline-block px-3 py-1 bg-zinc-900 text-white font-extrabold text-base tracking-wider rounded mb-1">
                  {documentType === 'remito' && `REMITO Nº ${remito?.numero_remito}`}
                  {documentType === 'presupuesto' && `PRESUPUESTO Nº ${presupuesto?.numero}`}
                  {documentType === 'recibo' && `RECIBO Nº ${recibo?.numero}`}
                </div>
                <p className="text-xs text-zinc-500 font-semibold mt-1">
                  FECHA:{' '}
                  {documentType === 'remito' && formatFecha(remito?.fecha || '')}
                  {documentType === 'presupuesto' && formatFecha(presupuesto?.fecha || '')}
                  {documentType === 'recibo' && formatFecha(recibo?.fecha || '')}
                </p>
                <p className="text-[10px] text-zinc-400 italic">Documento Interno de Control</p>
              </div>
            </div>
          </div>

          {/* Client & Vehicle Info Box */}
          <div className="grid grid-cols-2 gap-4 bg-zinc-50 border border-zinc-200 rounded-lg p-4 mb-6">
            <div>
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">DATOS DEL CLIENTE</p>
              <p className="font-extrabold text-zinc-900 text-base">{cliente?.razon_social || 'Cliente Ocasional'}</p>
              {cliente?.cuit && <p className="text-xs text-zinc-600">CUIT: {cliente.cuit}</p>}
              <p className="text-xs text-zinc-600">Teléfono: {cliente?.telefono || 'N/D'}</p>
              {cliente?.direccion && <p className="text-xs text-zinc-600">Dirección: {cliente.direccion}</p>}
            </div>

            <div className="border-l border-zinc-200 pl-4">
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">DATOS DEL VEHÍCULO</p>
              <p className="font-extrabold text-zinc-900 text-base">{vehiculo?.marca_modelo || 'Vehículo General'}</p>
              <p className="text-xs font-mono font-bold text-zinc-800">
                PATENTE (DOMINIO): <span className="bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">{vehiculo?.dominio || 'S/D'}</span>
              </p>
              {remito?.km ? (
                <p className="text-xs text-zinc-600">Kilometraje: {remito.km.toLocaleString()} km</p>
              ) : null}
            </div>
          </div>

          {/* Diagnosis / Work Description */}
          {(remito?.diagnostico_trabajo_realizado || presupuesto?.diagnostico) && (
            <div className="mb-6 bg-amber-50/50 border border-amber-200/80 rounded-lg p-3">
              <p className="text-xs font-bold text-amber-900 uppercase">
                {documentType === 'remito' ? 'TRABAJO Y DIAGNÓSTICO REALIZADO' : 'DIAGNÓSTICO Y TRABAJO A REALIZAR'}:
              </p>
              <p className="text-xs text-zinc-800 mt-1 whitespace-pre-line leading-relaxed">
                {remito?.diagnostico_trabajo_realizado || presupuesto?.diagnostico}
              </p>
            </div>
          )}

          {/* Table Items for Remito or Presupuesto */}
          {(documentType === 'remito' || documentType === 'presupuesto') && (
            <div className="mb-6">
              <table className="w-full text-left border-collapse border border-zinc-200">
                <thead>
                  <tr className="bg-zinc-900 text-white text-xs uppercase">
                    <th className="p-2 border border-zinc-800">Cód.</th>
                    <th className="p-2 border border-zinc-800">Detalle de Repuestos y Mano de Obra</th>
                    <th className="p-2 border border-zinc-800 text-center">Cant.</th>
                    <th className="p-2 border border-zinc-800 text-right">Precio Unit.</th>
                    <th className="p-2 border border-zinc-800 text-right">Importe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-xs">
                  {documentType === 'remito' &&
                    remito?.items.map((item, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}>
                        <td className="p-2 font-mono text-zinc-500 border border-zinc-200">
                          {item.codigo_repuesto || (item.tipo === 'mano_obra' ? 'MO' : 'REP')}
                        </td>
                        <td className="p-2 font-medium border border-zinc-200">
                          {item.descripcion}
                          {item.tipo === 'mano_obra' && <span className="text-[10px] text-amber-700 font-semibold ml-2">(Mano de Obra)</span>}
                        </td>
                        <td className="p-2 text-center border border-zinc-200">{item.cantidad}</td>
                        <td className="p-2 text-right border border-zinc-200">{formatPesos(item.precio_unitario_final)}</td>
                        <td className="p-2 text-right font-bold border border-zinc-200">{formatPesos(item.importe)}</td>
                      </tr>
                    ))}

                  {documentType === 'presupuesto' &&
                    presupuesto?.items.map((item, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}>
                        <td className="p-2 font-mono text-zinc-500 border border-zinc-200">
                          {item.tipo === 'mano_obra' ? 'MO' : 'REP'}
                        </td>
                        <td className="p-2 font-medium border border-zinc-200">{item.descripcion}</td>
                        <td className="p-2 text-center border border-zinc-200">{item.cantidad}</td>
                        <td className="p-2 text-right border border-zinc-200">{formatPesos(item.precio_unitario)}</td>
                        <td className="p-2 text-right font-bold border border-zinc-200">{formatPesos(item.importe)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Recibo specific body */}
          {documentType === 'recibo' && recibo && (
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-6 mb-6 text-center space-y-4">
              <p className="text-sm text-zinc-700">
                Recibimos de <span className="font-extrabold text-zinc-900 text-lg">{cliente?.razon_social}</span> la suma de:
              </p>
              <div className="text-3xl font-black text-amber-900 font-mono tracking-tight bg-white py-3 px-6 rounded border border-amber-400 inline-block shadow-xs">
                {formatPesos(recibo.monto)}
              </div>
              <div className="text-xs text-zinc-600 space-y-1">
                <p><span className="font-bold">MEDIO DE PAGO:</span> {recibo.medio_pago}</p>
                <p><span className="font-bold">CONCEPTO:</span> {recibo.concepto}</p>
              </div>
            </div>
          )}

          {/* Totals Section */}
          {(documentType === 'remito' || documentType === 'presupuesto') && (
            <div className="flex justify-end mb-8">
              <div className="w-72 bg-zinc-900 text-white p-4 rounded-lg space-y-2 shadow-sm">
                {documentType === 'remito' && remito && (
                  <>
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Total Repuestos:</span>
                      <span>{formatPesos(remito.total_precio_repuestos)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Mano de Obra:</span>
                      <span>{formatPesos(remito.total_mano_obra)}</span>
                    </div>
                    <div className="border-t border-zinc-700 my-1"></div>
                  </>
                )}
                <div className="flex justify-between text-base font-black text-amber-400 pt-1">
                  <span>TOTAL FINAL ARS:</span>
                  <span>
                    {documentType === 'remito'
                      ? formatPesos(remito?.total_final || 0)
                      : formatPesos(presupuesto?.total_estimado || 0)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Signatures & Footer */}
          <div className="mt-12 pt-8 border-t border-zinc-300 grid grid-cols-2 gap-12 text-center text-xs text-zinc-500">
            <div>
              <div className="border-b border-zinc-400 w-3/4 mx-auto mb-2 h-12"></div>
              <p className="font-bold text-zinc-800">Firma Taller / Responsable</p>
              <p className="text-[10px]">Cristian Bongiovanni</p>
            </div>
            <div>
              <div className="border-b border-zinc-400 w-3/4 mx-auto mb-2 h-12"></div>
              <p className="font-bold text-zinc-800">Conforme Cliente</p>
              <p className="text-[10px]">Aclaración y DNI</p>
            </div>
          </div>

          <div className="text-center text-[10px] text-zinc-400 mt-8 pt-4 border-t border-zinc-100">
            ¡Muchas gracias por elegir La Boutique del Automóvil! — Garantía y Confianza
          </div>
        </div>
      </div>
    </div>
  );
};
