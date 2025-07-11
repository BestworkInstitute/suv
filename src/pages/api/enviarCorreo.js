import nodemailer from 'nodemailer';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb' // 🆙 Aumenta límite para PDF
    }
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

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
      <table border="1" cellpadding="6" cellspacing="0">
        ${Object.entries(data)
          .filter(([k]) => k !== 'pdf' && k !== 'correos')
          .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${v}</td></tr>`)
          .join('')}
      </table>
    `;

    await transporter.sendMail({
      from: `"BestWork App" <${process.env.EMAIL_USER}>`,
      to: ['mrestovic@bestwork.cl', data.email],
      cc: ['cfigueroa@bestwork.cl'],
      subject: `Solicitud de permiso - ${data.nombre}`,
      html,
      attachments: [
        {
          filename: `solicitud_${data.nombre}.pdf`,
          content: data.pdf.split('base64,')[1],
          encoding: 'base64',
        },
      ]
    });

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
