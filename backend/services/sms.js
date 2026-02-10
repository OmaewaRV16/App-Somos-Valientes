const Telnyx = require("telnyx");
const telnyx = Telnyx(process.env.TELNYX_API_KEY);

async function enviarSMS(celular, codigo) {
  try {
    const response = await telnyx.messages.create({
      messaging_profile_id: process.env.TELNYX_PROFILE_ID, // 🔥 ESTO
      from: "SV",
      to: `+52${celular}`,
      text: `Tu código de verificación de Sociedad Valiente es ${codigo}`,
    });

    console.log("📩 SMS enviado (Telnyx):", response.id);
    return true;
  } catch (error) {
    console.error("❌ Error SMS Telnyx:", error);
    return false;
  }
}

module.exports = { enviarSMS };
