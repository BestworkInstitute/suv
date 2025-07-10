export const config = { api: { bodyParser: { sizeLimit: '5mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Método no permitido' });

  const {
    nombre, email, rut, celular = 'N/A',
    desdeDia = 'N/A', hastaDia = 'N/A',
    desdeHora = 'N/A', hastaHora = 'N/A',
    totalDias = 'N/A', totalHoras = 'N/A',
    departamento, permiso, motivo
  } = req.body;

  const payload = {
    NOMBRE: nombre,
    CORREO: email,
    CELULAR: celular,
    RUT: rut,
    DIASTOTALES: totalDias,
    FECHAINICIO: desdeDia,
    FECHAFIN: hastaDia,
    HORAINICIO: desdeHora,
    HORAFIN: hastaHora,
    HORASTOTALES: totalHoras,
    DEPARTAMENTO: departamento,
    TIPODEPERMISO: permiso,
    MOTIVO: motivo,
    NUMEROCONFIRMACION: 56991709265
  };

  try {
    const response = await fetch(process.env.MESSAGEBIRD_FLOW_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Flow fallido:', errText);
      return res.status(500).json({ error: 'Flow fallido', details: errText });
    }

    let result;
    try { result = await response.json(); }
    catch { result = await response.text(); }

    return res.status(200).json({ status: 'Flow ejecutado correctamente', result });
  } catch (err) {
    console.error('Error MessageBird:', err);
    return res.status(500).json({ error: err.message });
  }
}
