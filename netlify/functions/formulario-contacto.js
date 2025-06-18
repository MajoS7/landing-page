const { config } = require("dotenv");
const nodemailer = require("nodemailer");
config();
const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
function enviarMail(mail) {
  return new Promise((resolve, reject) => {
    transport.sendMail(mail, (error, _) => {
      error
        ? reject({
            statusCode: 500,
            body: error,
          })
        : resolve({
            statusCode: 200,
            body: "Correo electronico enviado con éxito a " + mail.to,
          });
    });
  });
}
function generarCuerpoMensaje(params) {
  const escape = (text) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const nombre = escape(params.nombre || '');
  const correo = escape(params.correo || '');
  const mensaje = escape(params.mensaje || '');

  return `
    <div style="background-color:#f0fdf4; font-family:Arial,sans-serif; color:#1f2937; padding:20px;">
      <div style="background-color:#059669; color:white; padding:40px 20px; text-align:center; border-radius:12px;">
        <h1 style="font-size:30px; margin-bottom:10px;">No Más Desperdicio, Más Solidaridad</h1>
        <p style="font-size:16px;">Conectamos excedentes alimentarios con quienes más los necesitan en Colombia</p>
      </div>

      <div style="max-width:600px; margin:40px auto; background:white; border-radius:16px; padding:30px; box-shadow:0 4px 8px rgba(0,0,0,0.1);">
        <h2 style="color:#047857; font-size:22px; margin-bottom:20px;">📬 Nuevo Mensaje desde el Formulario de Contacto</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Correo electrónico:</strong> ${correo}</p>
        <p><strong>Mensaje:</strong></p>
        <div style="margin-top:10px; padding:15px; background-color:#f0fdf4; border-left:4px solid #047857; color:#374151;">
          ${mensaje}
        </div>
        <p style="margin-top:30px; font-size:12px; color:#6b7280; text-align:center;">
          Este mensaje fue enviado automáticamente desde el sitio web.
        </p>
      </div>
      <div style="text-align:center; margin-top:30px; margin-bottom:20px;">
        <a href="https://www.facebook.com/profile.php?id=61577184611681" target="_blank" aria-label="Facebook" style="margin: 0 12px; display:inline-block; color: #1f2937;">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2v-2.9h2V9.3c0-2 1.2-3.1 3-3.1.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2v1.5h2.3l-.4 2.9H14v7A10 10 0 0 0 22 12Z"/>
          </svg>
        </a>
        <a href="https://www.instagram.com/ali.mentosparatodos/" target="_blank" aria-label="Instagram" style="margin: 0 12px; display:inline-block; color: #1f2937;">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm0 2h10c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3zm5 2.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 6.5zm0 2A2.5 2.5 0 1 1 9.5 11 2.5 2.5 0 0 1 12 8.5zm4.5-2a1 1 0 1 0 1 1 1 1 0 0 0-1-1z"/>
          </svg>
        </a>
        <a href="https://www.tiktok.com/@alimentosparatod" target="_blank" aria-label="TikTok" style="margin: 0 12px; display:inline-block; color: #1f2937;">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.3 1a6.5 6.5 0 0 0 3.4 2.1v3.4a9.3 9.3 0 0 1-3.5-1V13a6 6 0 1 1-6-6h.7v3.2H10a2.7 2.7 0 1 0 2.4 2.7V1h3.9z"/>
          </svg>
        </a>
      </div>
      <footer style="text-align:center; font-size:12px; color:#6b7280; margin-top:20px;">
        © 2025 Plataforma Alimentaria Solidaria. Todos los derechos reservados.
      </footer>
    </div>
  `;
}
exports.handler = async (event, context) => {
  switch (event.httpMethod) {
    case "POST":
      const params = JSON.parse(event.body);
      console.log("Recibi una solicitud", params);
      return await enviarMail({
        from: process.env.EMAIL_USER,
        to: params.correo,
        subject: "💌 Mensaje recibido de alguien interesado en apoyar",
        html: generarCuerpoMensaje(params),
      });
    default:
      return {
        statusCode: 405,
        message: "Método no soportado",
      };
  }
};
