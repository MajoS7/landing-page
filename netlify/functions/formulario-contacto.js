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
        <p style="margin-top:30px; font-size:12px; color:#6b7280;">Este mensaje fue enviado automáticamente desde el sitio web.</p>
      </div>

      <footer style="text-align:center; font-size:12px; color:#6b7280; margin-top:40px;">
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
        text: generarCuerpoMensaje(params),
      });
    default:
      return {
        statusCode: 405,
        message: "Método no soportado",
      };
  }
};
