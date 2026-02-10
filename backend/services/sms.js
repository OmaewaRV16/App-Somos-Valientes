const Telnyx = require("telnyx");
const telnyx = Telnyx(process.env.TELNYX_API_KEY);

async function enviarSMS(celular, codigo) {
  try {
    const response = await telnyx.messages.send({
      messaging_profile_id: process.env.TELNYX_PROFILE_ID,
      from: "sv", // EXACTO al remitente
      to: `+52${celular}`,
      text: `Codigo Sociedad Valiente: ${codigo}`,
    });

    console.log("📩 SMS enviado (Telnyx):", response.data.id);
    return true;
  } catch (error) {
    console.error(
      "❌ Error SMS Telnyx:",
      error.response?.data || error.message || error
    );
    return false;
  }
}

module.exports = { enviarSMS };
