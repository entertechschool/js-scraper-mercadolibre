const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const PORT = 3000;

const WEB_URL = "https://listado.mercadolibre.com.pe/";

app.get("/", (req, res) => {
	res.json({
		message: "Bienvenido",
	});
});

app.get("/mercadolibre", async (req, res) => {
	// Lógica de Scrapping:
	const { query } = req.query;
	// GET a la web de mercado libre con el parámetro de busqueda:
	const { data } = await axios.get(WEB_URL + query);

	const $ = cheerio.load(data);

	const products = [];

	const $listProducts = $("div.poly-card.poly-card--list");

	$listProducts.each((index, element) => {
		const title = $(element).find("h2").text();
		const price = $(element).find("div.poly-price__current span.andes-money-amount__fraction").text().replace(".", "");
		const fixedPrice = parseInt(price);
		products.push({
			title,
			price: fixedPrice,
		});
	});

	const avg_prices = products.reduce((sum, product) => sum + product.price, 0) / products.length;

	res.json({
		avg_prices: avg_prices,
		products: products,
		message: "Scrapping de Mercado Libre: " + query,
	});
});

app.listen(PORT, () => console.log("Listening on PORT", PORT));
