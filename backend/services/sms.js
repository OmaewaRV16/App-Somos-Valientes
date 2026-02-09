const { Vonage } = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: process.env.VONAGE_KEY,
  apiSecret: process.env.VONAGE_SECRET,
});

async function enviarSMS(celular, codigo) {
  try {
    const response = await vonage.sms.send({
      to: `52${celular}`, // México
      from: "SV",
      text: `Tu código de verificación para Sociedad Valiente es ${codigo}`,
    });

    console.log("📩 SMS enviado:", response);
    return true;
  } catch (error) {
    console.error("❌ Error enviando SMS:", error);
    return false;
  }
}

module.exports = { enviarSMS };
