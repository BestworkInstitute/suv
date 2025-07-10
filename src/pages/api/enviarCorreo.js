import nodemailer from 'nodemailer';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb' // 🆙 Límite ampliado
    }
  }
};

export default async function handler(req, res) {
  // ✅ Aquí pausas el envío real del correo:

  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  try {
    const data = req.body;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const html = `
      <h2>Solicitud de Permiso</h2>
      <table>
        ${Object.entries(data)
          .filter(([k]) => k !== 'pdf')
          .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${v}</td></tr>`)
          .join('')}
      </table>
    `;

    await transporter.sendMail({
      from: `"BestWork App" <${process.env.EMAIL_USER}>`,
      to: `${data.email}, mrestovic@bestwork.cl`,
      subject: `Solicitud de permiso - ${data.nombre}`,
      html,
      attachments: [
        {
          filename: `solicitud_${data.nombre}.pdf`,
          content: data.pdf.split('base64,')[1],
          encoding: 'base64',
        },
      ],
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
