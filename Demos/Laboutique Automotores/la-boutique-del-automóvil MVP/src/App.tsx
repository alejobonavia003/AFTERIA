import React, { useState } from 'react';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { RemitosModule } from './components/RemitosModule';
import { PresupuestosModule } from './components/PresupuestosModule';
import { CobranzasModule } from './components/CobranzasModule';
import { CajaBancoModule } from './components/CajaBancoModule';
import { ClientesVehiculosModule } from './components/ClientesVehiculosModule';
import { ConfiguracionModule } from './components/ConfiguracionModule';
import { PrintModal } from './components/PrintModal';

import {
  Cliente,
  Vehiculo,
  Proveedor,
  Presupuesto,
  OrdenTrabajo,
  PagoCliente,
  MovimientoCajaBanco,
  Recibo,
  ConfigTarifario,
  EntregaPago
} from './types';

import {
  initialClientes,
  initialVehiculos,
  initialProveedores,
  initialConfigTarifario,
  initialPresupuestos,
  initialOrdenesTrabajo,
  initialPagosClientes,
  initialRecibos,
  initialMovimientosCajaBanco,
  CATEGORIAS_GASTO,
  TIPOS_TRABAJO,
  MECANICOS
} from './data/initialSeedData';

import { exportRendimientoMensualExcel } from './utils/excelExport';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Domain State Collections
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>(initialVehiculos);
  const [proveedores, setProveedores] = useState<Proveedor[]>(initialProveedores);
  const [config, setConfig] = useState<ConfigTarifario>(initialConfigTarifario);
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>(initialPresupuestos);
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>(initialOrdenesTrabajo);
  const [pagos, setPagos] = useState<PagoCliente[]>(initialPagosClientes);
  const [recibos, setRecibos] = useState<Recibo[]>(initialRecibos);
  const [movimientos, setMovimientos] = useState<MovimientoCajaBanco[]>(initialMovimientosCajaBanco);

  const [mecanicosList, setMecanicosList] = useState<string[]>(MECANICOS);
  const [tiposTrabajoList, setTiposTrabajoList] = useState<string[]>(TIPOS_TRABAJO);
  const [categoriasGastoList, setCategoriasGastoList] = useState<string[]>(CATEGORIAS_GASTO);

  // Print Modal State
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printType, setPrintType] = useState<'remito' | 'presupuesto' | 'recibo'>('remito');
  const [printData, setPrintData] = useState<any>({});

  // Global Quick Metrics
  const totalDeudaClientes = pagos.reduce((s, p) => s + p.deuda_pendiente, 0);
  const totalDeudoresCount = pagos.filter((p) => p.deuda_pendiente > 0).length;
  
  const tallerIngresos = movimientos.filter((m) => m.unidad_negocio === 'Taller').reduce((s, m) => s + (m.ingreso || 0), 0);
  const tallerEgresos = movimientos.filter((m) => m.unidad_negocio === 'Taller').reduce((s, m) => s + (m.egreso || 0), 0);
  const saldoTallerTotal = tallerIngresos - tallerEgresos;

  // Print Modal Triggers
  const triggerPrintRemito = (remito: OrdenTrabajo) => {
    const cli = clientes.find((c) => c.id === remito.cliente_id);
    const veh = vehiculos.find((v) => v.id === remito.vehiculo_id);
    setPrintType('remito');
    setPrintData({ remito, cliente: cli, vehiculo: veh });
    setPrintModalOpen(true);
  };

  const triggerPrintPresupuesto = (presupuesto: Presupuesto) => {
    const cli = clientes.find((c) => c.id === presupuesto.cliente_id);
    const veh = vehiculos.find((v) => v.id === presupuesto.vehiculo_id);
    setPrintType('presupuesto');
    setPrintData({ presupuesto, cliente: cli, vehiculo: veh });
    setPrintModalOpen(true);
  };

  const triggerPrintRecibo = (recibo: Recibo, cliente: Cliente, remito?: OrdenTrabajo) => {
    const veh = remito ? vehiculos.find((v) => v.id === remito.vehiculo_id) : undefined;
    setPrintType('recibo');
    setPrintData({ recibo, cliente, remito, vehiculo: veh });
    setPrintModalOpen(true);
  };

  // Actions
  const handleSaveRemito = (newRemito: OrdenTrabajo, pagoInicial: number = 0) => {
    setOrdenes([newRemito, ...ordenes]);

    // Create corresponding PagoCliente record
    const newPagoId = Date.now();
    const entregas: EntregaPago[] = [];

    let totalCobrado = 0;

    if (pagoInicial > 0) {
      const nextReciboNum = recibos.length > 0 ? Math.max(...recibos.map((r) => r.numero)) + 1 : 6;
      
      const newRecibo: Recibo = {
        id: Date.now() + 10,
        numero: nextReciboNum,
        fecha: newRemito.fecha,
        cliente_id: newRemito.cliente_id,
        orden_trabajo_id: newRemito.id,
        monto: pagoInicial,
        medio_pago: 'Efectivo',
        concepto: `Cobro inicial Remito #${newRemito.numero_remito}`
      };
      setRecibos((prev) => [...prev, newRecibo]);

      entregas.push({
        id: Date.now() + 20,
        pago_cliente_id: newPagoId,
        numero_entrega: 1,
        monto: pagoInicial,
        fecha: newRemito.fecha,
        medio_pago: 'Efectivo',
        recibo_id: newRecibo.id,
        numero_recibo: nextReciboNum,
        notas: 'Cobro inicial al retirar'
      });

      totalCobrado = pagoInicial;

      // Register Movimiento Caja
      const cli = clientes.find((c) => c.id === newRemito.cliente_id);
      const prevSaldo = movimientos[movimientos.length - 1]?.saldo_acumulado || 0;
      setMovimientos((prev) => [
        ...prev,
        {
          id: Date.now() + 30,
          libro: 'caja',
          fecha: newRemito.fecha,
          concepto: 'Pago cliente',
          unidad_negocio: 'Taller',
          detalle: `Cobro Remito #${newRemito.numero_remito} (${cli?.razon_social})`,
          proveedor: cli?.razon_social || '',
          tipo_movimiento: 'Efectivo',
          ingreso: pagoInicial,
          egreso: 0,
          facturado_a_sas: false,
          saldo_acumulado: prevSaldo + pagoInicial
        }
      ]);
    }

    const newPago: PagoCliente = {
      id: newPagoId,
      orden_trabajo_id: newRemito.id,
      cliente_id: newRemito.cliente_id,
      total_trabajo: newRemito.total_final,
      deuda_pendiente: Math.max(0, newRemito.total_final - totalCobrado),
      metodo_pago_principal: 'Efectivo',
      meses_deuda: 0,
      comentario: pagoInicial > 0 ? 'Pago inicial registrado' : 'Deuda pendiente',
      entregas: entregas
    };

    setPagos((prev) => [newPago, ...prev]);

    // Open print view automatically
    triggerPrintRemito(newRemito);
  };

  const handleConvertirPresupuestoARemito = (presupuesto: Presupuesto) => {
    // Update budget status
    setPresupuestos((prev) =>
      prev.map((p) => (p.id === presupuesto.id ? { ...p, estado: 'convertido' as const } : p))
    );

    const nextRemitoNum = ordenes.length > 0 ? Math.max(...ordenes.map((o) => o.numero_remito)) + 1 : 2396;

    const newRemito: OrdenTrabajo = {
      id: Date.now(),
      numero_remito: nextRemitoNum,
      fecha: new Date().toISOString().split('T')[0],
      cliente_id: presupuesto.cliente_id,
      vehiculo_id: presupuesto.vehiculo_id,
      km: 100000,
      presupuesto_origen_id: presupuesto.id,
      diagnostico_trabajo_realizado: presupuesto.diagnostico,
      mecanico_responsable: mecanicosList[0] || 'Federico',
      tipo_trabajo: 'General',
      estado: 'entregado',
      total_costo_repuestos: presupuesto.total_estimado * 0.6,
      total_precio_repuestos: presupuesto.total_estimado * 0.7,
      total_mano_obra: presupuesto.total_estimado * 0.3,
      total_sin_iva: Number((presupuesto.total_estimado / 1.21).toFixed(2)),
      iva: Number((presupuesto.total_estimado - presupuesto.total_estimado / 1.21).toFixed(2)),
      total_final: presupuesto.total_estimado,
      items: presupuesto.items.map((i, idx) => ({
        id: Date.now() + idx,
        tipo: i.tipo,
        descripcion: i.descripcion,
        costo_sin_iva: i.tipo === 'repuesto' ? i.precio_unitario * 0.6 : 0,
        iva_pct: 0.21,
        costo_con_iva: i.tipo === 'repuesto' ? i.precio_unitario * 0.72 : 0,
        cantidad: i.cantidad,
        pct_ganancia: 0.20,
        precio_unitario_final: i.precio_unitario,
        importe: i.importe
      }))
    };

    handleSaveRemito(newRemito, 0);
    setActiveTab('remitos');
  };

  const handleRegisterEntrega = (pagoId: number, entregaData: Omit<EntregaPago, 'id'>) => {
    const pagoObj = pagos.find((p) => p.id === pagoId);
    if (!pagoObj) return;

    const cli = clientes.find((c) => c.id === pagoObj.cliente_id);
    const ot = ordenes.find((o) => o.id === pagoObj.orden_trabajo_id);

    // Create Recibo
    const newRecibo: Recibo = {
      id: Date.now(),
      numero: entregaData.numero_recibo || 1,
      fecha: entregaData.fecha,
      cliente_id: pagoObj.cliente_id,
      orden_trabajo_id: pagoObj.orden_trabajo_id,
      monto: entregaData.monto,
      medio_pago: entregaData.medio_pago,
      concepto: `Entrega #${entregaData.numero_entrega} - Remito #${ot?.numero_remito}`
    };

    setRecibos((prev) => [...prev, newRecibo]);

    const newEntrega: EntregaPago = {
      ...entregaData,
      id: Date.now() + 1,
      recibo_id: newRecibo.id
    };

    // Update PagoCliente
    setPagos((prev) =>
      prev.map((p) => {
        if (p.id === pagoId) {
          const updatedEntregas = [...p.entregas, newEntrega];
          const totalCobrado = updatedEntregas.reduce((sum, e) => sum + e.monto, 0);
          const newDeuda = Math.max(0, p.total_trabajo - totalCobrado);
          return {
            ...p,
            deuda_pendiente: newDeuda,
            entregas: updatedEntregas
          };
        }
        return p;
      })
    );

    // Add Movimiento
    const libroTarget = entregaData.medio_pago === 'Efectivo' ? 'caja' : 'banco';
    const prevSaldo = movimientos[movimientos.length - 1]?.saldo_acumulado || 0;

    setMovimientos((prev) => [
      ...prev,
      {
        id: Date.now() + 2,
        libro: libroTarget,
        fecha: entregaData.fecha,
        concepto: 'Pago cliente',
        unidad_negocio: 'Taller',
        detalle: `Cobro Remito #${ot?.numero_remito} (${cli?.razon_social})`,
        proveedor: cli?.razon_social || '',
        tipo_movimiento: entregaData.medio_pago,
        ingreso: entregaData.monto,
        egreso: 0,
        facturado_a_sas: false,
        saldo_acumulado: prevSaldo + entregaData.monto
      }
    ]);

    // Print generated Recibo
    if (cli) {
      triggerPrintRecibo(newRecibo, cli, ot);
    }
  };

  const handleAddMovimiento = (mov: Omit<MovimientoCajaBanco, 'id' | 'saldo_acumulado'>) => {
    const prevSaldo = movimientos[movimientos.length - 1]?.saldo_acumulado || 0;
    const neto = (mov.ingreso || 0) - (mov.egreso || 0);

    const newMov: MovimientoCajaBanco = {
      ...mov,
      id: Date.now(),
      saldo_acumulado: prevSaldo + neto
    };

    setMovimientos((prev) => [...prev, newMov]);
  };

  const handleAddClienteInline = (newCli: Omit<Cliente, 'id'>): Cliente => {
    const created: Cliente = {
      ...newCli,
      id: Date.now()
    };
    setClientes((prev) => [created, ...prev]);
    return created;
  };

  const handleAddVehiculoInline = (newVeh: Omit<Vehiculo, 'id'>): Vehiculo => {
    const created: Vehiculo = {
      ...newVeh,
      id: Date.now()
    };
    setVehiculos((prev) => [created, ...prev]);
    return created;
  };

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 flex flex-col font-sans">
      
      {/* Header */}
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenNuevoRemito={() => setActiveTab('remitos')}
        onExportExcel={() => exportRendimientoMensualExcel(ordenes, clientes, vehiculos, pagos, 'Julio 2026')}
        totalDeudaClientes={totalDeudaClientes}
        totalDeudoresCount={totalDeudoresCount}
        remitosMesCount={ordenes.length}
        saldoTallerTotal={saldoTallerTotal}
      />

      {/* Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        deudoresCount={totalDeudoresCount}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'dashboard' && (
          <Dashboard
            ordenes={ordenes}
            clientes={clientes}
            vehiculos={vehiculos}
            pagos={pagos}
            movimientos={movimientos}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'remitos' && (
          <RemitosModule
            ordenes={ordenes}
            clientes={clientes}
            vehiculos={vehiculos}
            proveedores={proveedores}
            pagos={pagos}
            config={config}
            mecanicos={mecanicosList}
            tiposTrabajo={tiposTrabajoList}
            searchTerm={searchTerm}
            onSaveRemito={handleSaveRemito}
            onPrintRemito={triggerPrintRemito}
            onAddClienteInline={handleAddClienteInline}
            onAddVehiculoInline={handleAddVehiculoInline}
          />
        )}

        {activeTab === 'presupuestos' && (
          <PresupuestosModule
            presupuestos={presupuestos}
            clientes={clientes}
            vehiculos={vehiculos}
            searchTerm={searchTerm}
            onSavePresupuesto={(p) => setPresupuestos([p, ...presupuestos])}
            onConvertirARemito={handleConvertirPresupuestoARemito}
            onPrintPresupuesto={triggerPrintPresupuesto}
          />
        )}

        {activeTab === 'cobranzas' && (
          <CobranzasModule
            pagos={pagos}
            ordenes={ordenes}
            clientes={clientes}
            vehiculos={vehiculos}
            recibos={recibos}
            searchTerm={searchTerm}
            onRegisterEntrega={handleRegisterEntrega}
            onPrintRecibo={triggerPrintRecibo}
          />
        )}

        {activeTab === 'cajabanco' && (
          <CajaBancoModule
            movimientos={movimientos}
            searchTerm={searchTerm}
            onAddMovimiento={handleAddMovimiento}
          />
        )}

        {activeTab === 'clientes' && (
          <ClientesVehiculosModule
            clientes={clientes}
            vehiculos={vehiculos}
            ordenes={ordenes}
            presupuestos={presupuestos}
            searchTerm={searchTerm}
            onAddCliente={(c) => handleAddClienteInline(c)}
            onAddVehiculo={(v) => handleAddVehiculoInline(v)}
            onPrintRemito={triggerPrintRemito}
          />
        )}

        {activeTab === 'configuracion' && (
          <ConfiguracionModule
            config={config}
            proveedores={proveedores}
            mecanicos={mecanicosList}
            tiposTrabajo={tiposTrabajoList}
            categoriasGasto={categoriasGastoList}
            onSaveConfig={setConfig}
            onAddProveedor={(prov) => setProveedores([...proveedores, { ...prov, id: Date.now() }])}
            onAddMecanico={(m) => setMecanicosList([...mecanicosList, m])}
            onAddTipoTrabajo={(t) => setTiposTrabajoList([...tiposTrabajoList, t])}
            onAddCategoria={(cat) => setCategoriasGastoList([...categoriasGastoList, cat])}
          />
        )}

      </main>

      {/* Printable Document Modal */}
      <PrintModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        documentType={printType}
        data={printData}
      />

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 border-t border-zinc-800 text-xs py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            <span className="font-bold text-white">La Boutique del Automóvil</span> — Cristian Bongiovanni
          </div>
          <div className="text-[11px] text-zinc-500">
            Gral. Deheza 191, Laboulaye (6120), Córdoba | Sistema de Gestión Integral de Taller
          </div>
        </div>
      </footer>

    </div>
  );
}
