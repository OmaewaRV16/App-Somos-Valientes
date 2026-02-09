async function enviarSMS(celular, codigo) {
  try {
    const response = await vonage.sms.send({
      to: `52${celular}`,
      from: "Vonage",
      text: `Tu código de verificación para Sociedad Valiente es ${codigo}`,
    });

    console.log("📩 SMS enviado:", response);
    return true;
  } catch (error) {
    console.error("❌ Error enviando SMS:", error);
    return false;
  }
}
