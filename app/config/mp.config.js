import { loadMercadoPago } from "@mercadopago/sdk-js";
require("dotenv").config();
await loadMercadoPago();

const mercadopago = new window.MercadoPago(process.env.MP_ACCESS_TOKEN,);
module.exports = {  
    mercadopago
};