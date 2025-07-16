import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { colaboradores } from './colaboradores';

export default function Home() {
  const [modo, setModo] = useState('dias');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [datos, setDatos] = useState({
    nombre: '',
    rut: '',
    email: '',
    celular: '',
    departamento: '',
    permiso: 'VACACIONES',
    desdeDia: '',
    hastaDia: '',
    desdeHora: '',
    hastaHora: '',
    fechaHora: '',
    motivo: '',
    totalDias: '',
  });

  useEffect(() => {
    const hoy = new Date();
    const dia = hoy.getDate().toString().padStart(2, '0');
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const anio = hoy.getFullYear();
    document.getElementById("fecha-actual").textContent = `${dia}-${mes}-${anio}`;
  }, []);

  const alternarModo = nuevo => {
    setModo(nuevo);
    if (nuevo === 'horas') {
      setDatos(prev => ({ ...prev, desdeDia: '', hastaDia: '', totalDias: '' }));
    } else {
      setDatos(prev => ({ ...prev, fechaHora: '', desdeHora: '', hastaHora: '' }));
    }
  };

  const calcularDias = () => {
    const desde = new Date(datos.desdeDia), hasta = new Date(datos.hastaDia);
    const feriados = ["2025-07-16", "2025-08-15", "2025-09-18", "2025-09-19", "2025-09-20", "2025-10-12", "2025-10-27", "2025-10-31", "2025-11-01", "2025-11-24", "2025-12-08", "2025-12-25"];
    let count = 0, cur = new Date(desde);
    while (cur <= hasta) {
      const iso = cur.toISOString().split('T')[0];
      const day = cur.getDay();
      if (day !== 0 && day !== 6 && !feriados.includes(iso)) count++;
      cur.setDate(cur.getDate() + 1);
    }
    setDatos(prev => ({ ...prev, totalDias: isNaN(count) ? '' : count }));
  };

  const handleChange = e => {
  const { id, value } = e.target;
  if (id === 'nombre') {
    const sel = colaboradores.find(c => c.nombre === value);
    if (sel) {
      setDatos(prev => ({
        ...prev,
        nombre: sel.nombre,
        rut: sel.rut,
        departamento: sel.area.toUpperCase(),
        email: sel.correo || '',
        celular: sel.celular || ''
      }));
      return;
    }
  }
  setDatos(prev => ({ ...prev, [id]: value }));
};


  const validar = () => {
    const campos = ['nombre','rut','email','departamento','motivo'];
    for (const campo of campos) {
      if (!datos[campo]) return `Falta completar: ${campo}`;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(datos.email)) return 'Email inválido';
    if (modo === 'dias' && (!datos.desdeDia || !datos.hastaDia)) return 'Faltan fechas para días';
    if (modo === 'horas' && (!datos.fechaHora || !datos.desdeHora || !datos.hastaHora)) return 'Faltan datos para horas';
    return '';
  };

  const generarPDFyEnviar = async () => {
    const errorMsg = validar();
    if (errorMsg) {
      setError(errorMsg);
      return alert('❌ ' + errorMsg);
    }
    setError('');
    setLoading(true);
    try {
      const content = document.getElementById("pdf-preview");
      const origBg = content.style.background;
      content.style.background = '#fff';
      const canvas = await html2canvas(content, { scale: 2 });
      content.style.background = origBg;

      const img = canvas.toDataURL("image/jpeg", 1);
      const doc = new jsPDF("p", "mm", "a4");
      const w = doc.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      doc.addImage(img, "JPEG", 0, 0, w, h);
      const pdfBase64 = doc.output('datauristring');
      doc.save(`solicitud_permiso_${datos.nombre || 'trabajador'}.pdf`);

      const numeroConfirmacion = Math.floor(Math.random() * 900000 + 100000).toString();

      const payload = {
        ...datos,
        totalDias: datos.totalDias || 'N/A',
        desdeHora: datos.desdeHora || 'N/A',
        hastaHora: datos.hastaHora || 'N/A',
        fechaHora: datos.fechaHora || 'N/A',
        totalHoras: 'N/A',
        celular: datos.celular || 'N/A',
        pdf: pdfBase64,
        correos: ['mrestovic@bestwork.cl', 'cfigueroa@bestwork.cl'],
      };

      const flowPayload = {
        NOMBRE: datos.nombre,
        CORREO: datos.email,
        CELULAR: datos.celular || 'N/A',
        RUT: datos.rut,
        DIASTOTALES: datos.totalDias || '0',
        FECHAINICIO: datos.desdeDia || datos.fechaHora || '',
        FECHAFIN: datos.hastaDia || datos.fechaHora || '',
        HORAINICIO: datos.desdeHora || 'N/A',
        HORAFIN: datos.hastaHora || 'N/A',
        HORASTOTALES: 'N/A',
        DEPARTAMENTO: datos.departamento,
        TIPODEPERMISO: datos.permiso,
        MOTIVO: datos.motivo,
        NUMEROCONFIRMACION: numeroConfirmacion,
      };

      const resp1 = await fetch('/api/enviarCorreo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!resp1.ok) throw new Error('Error al enviar correo');

      const resp2 = await fetch('https://flows.messagebird.com/flows/fcb3d826-b1a6-4df5-8c12-7663ba11ce6e/invoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flowPayload)
      });
      if (!resp2.ok) throw new Error('Error al activar Flow');

      alert('✅ PDF enviado por correo y Flow activado');
    } catch (err) {
      console.error(err);
      alert('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container" id="pdf-preview">
        <div className="fecha-actual" id="fecha-actual"></div>
        <h2>Solicitud de Permiso</h2>

        <label>Nombre</label>
        <input id="nombre" list="nombres" value={datos.nombre} onChange={handleChange} />
        <datalist id="nombres">
          {colaboradores.map(c => <option key={c.rut} value={c.nombre}/>)}
        </datalist>

        <label>RUT</label>
        <input id="rut" value={datos.rut} readOnly />

        <label>Email</label>
        <input id="email" type="email" value={datos.email} onChange={handleChange} />

        <label>Celular</label>
        <input id="celular" type="tel" value={datos.celular} onChange={handleChange} />

        <label>Departamento</label>
        <input id="departamento" value={datos.departamento} readOnly />

        <label>Tipo de Permiso</label>
        <select id="permiso" value={datos.permiso} onChange={handleChange}>
          <option value="VACACIONES">Vacaciones</option>
          <option value="PERMISO CON GOCE DE SUELDO">Con goce de sueldo</option>
          <option value="PERMISO SIN GOCE DE SUELDO">Sin goce de sueldo</option>
        </select>

        <div className="radio-row">
          <label><input type="radio" checked={modo === 'dias'} onChange={() => alternarModo('dias')} /> Por días</label>
          <label><input type="radio" checked={modo === 'horas'} onChange={() => alternarModo('horas')} /> Por horas</label>
        </div>

        {modo === 'dias' && (
          <div className="row">
            <div className="col">
              <label>Desde</label>
              <input id="desdeDia" type="date" value={datos.desdeDia} onChange={handleChange} onBlur={calcularDias} />
            </div>
            <div className="col">
              <label>Hasta</label>
              <input id="hastaDia" type="date" value={datos.hastaDia} onChange={handleChange} onBlur={calcularDias} />
            </div>
          </div>
        )}

              {modo === 'dias' && (
        <>
          <label>Días totales</label>
          <input type="number" value={datos.totalDias} readOnly />
        </>
      )}

        {modo === 'horas' && (
          <>
            <label>Fecha del permiso</label>
            <input id="fechaHora" type="date" value={datos.fechaHora} onChange={handleChange} />
            <div className="row">
              <div className="col">
                <label>Desde</label>
                <input id="desdeHora" type="time" value={datos.desdeHora} onChange={handleChange} />
              </div>
              <div className="col">
                <label>Hasta</label>
                <input id="hastaHora" type="time" value={datos.hastaHora} onChange={handleChange} />
              </div>
            </div>
          </>
        )}

        <label>Motivo</label>
        <textarea id="motivo" rows="3" value={datos.motivo} onChange={handleChange}></textarea>

        <div className="firmado-label">Firman electrónicamente</div>
        <div className="firma-contenedor">
          <div className="firma-box">
            <strong>Trabajador</strong><br />
            {datos.nombre}<br />
            {datos.rut}<br />
            {datos.email}
          </div>
          <div className="firma-box">
            <strong>Gerente Bestwork</strong><br />
            Maximiliano Andrés Restovic Majluf<br />
            15657156-3<br />
            mrestovic@bestwork.cl
          </div>
        </div>
      </div>

      <button className="btn" onClick={generarPDFyEnviar} disabled={loading}>
        {loading ? '⏳ Enviando...' : '📤 Generar PDF y Enviar'}
      </button>

      <style jsx>{`
        * { box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; margin: 0; }
        .container {
          max-width: 800px;
          background: #fff;
          margin: 40px auto;
          padding: 30px;
          border-radius: 8px;
          color: #333;
          font-size: 14px;
        }
        .fecha-actual {
          text-align: right;
          font-size: 12px;
          color: #888;
        }
        h2 {
          text-align: center;
          color: #00AEEF;
          margin-top: 10px;
          margin-bottom: 30px;
        }
        label { font-weight: 600; display: block; margin: 10px 0 5px; }
        input, select, textarea {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
          background: #fdfdfd;
        }
        .row { display: flex; gap: 20px; flex-wrap: wrap; margin: 10px 0; }
        .col { flex: 1; min-width: 150px; }
        .radio-row label { font-weight: normal; display: inline-block; margin-right: 15px; }
        textarea { resize: none; }
        .firmado-label {
          font-weight: bold;
          text-align: center;
          margin-top: 40px;
          font-size: 15px;
          padding-top: 20px;
          border-top: 1px solid #ccc;
        }
        .firma-contenedor {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          gap: 20px;
        }
        .firma-box {
          flex: 1;
          text-align: center;
          padding: 15px;
          border: 1px dashed #ccc;
          border-radius: 8px;
          font-size: 13px;
          line-height: 1.4;
        }
        .btn {
          background: #002855;
          color: white;
          padding: 12px 25px;
          font-size: 16px;
          font-weight: 500;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: block;
          margin: 20px auto 60px;
          position: relative;
          transition: all 0.3s ease;
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}
