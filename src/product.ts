import * as path from 'path';
import * as fs from 'fs';
import express = require('express');
import {
	Application,
	Request,
	Response
} from "express";
const app: Application = express(); //init express application
app.use(express.json());
const PORT: number = 5000;
interface Product {
	id: number;
	name: string;
	rawPrice: number;
	price: number;
	code: string;
	color ? : string;
	categoryid: any;
	description ? : string;
	stockCount ? : number;
	expirationDate ? : Date
}
const products: Partial < Product[] >= JSON.parse(fs.readFileSync(path.join(__dirname, 'Product.json'), 'utf-8'));
app.get('/api/products', (req: Request, res: Response) => {
	res.send(products)
});
app.get('/api/products/:id', (req: Request, res: Response) => {
	const product = products.find(c => c.id === parseInt(req.params.id));
	if(!product) return res.status(404).send('The product with the given ID is not found')
	else res.send(product)
});
app.post('/api/products', function(req: Request, res: Response) {
	if(typeof req.body.name !== 'string' || req.body.name === undefined) {
		return res.status(404).send('you must send name property as string');
	} else if(typeof req.body.rawPrice !== 'number' || req.body.rawPrice === undefined) {
		return res.status(404).send('you must send rawPrice property as number');
	} else if(typeof req.body.price !== 'number' || req.body.price === undefined || req.body.price <= 0 || req.body.price < req.body.rawPrice) {
		return res.status(404).send('you must send price property as number, grater than 0 and grater than rawPrice');
	} else if(typeof req.body.code !== 'string' || req.body.code === undefined || req.body.code.length !== 12 || req.body.code.substring(0, 3) !== req.body.code.substring(0, 3).toUpperCase() || req.body.code.charAt(3) !== '-' || req.body.code.substring(4, 7) !== req.body.code.substring(4, 7).toLowerCase() || req.body.code.charAt(7) !== '-' || isNaN(+req.body.code.substring(8, 12))) {
		return res.status(404).send('you must send code property as string and consist of 12 char and the format like this ABC-abc-1234');
	} else if(req.body.categoryid === undefined) {
		return res.status(404).send('you must send categoryid');
	}
	if(req.body.color !== undefined) {
		if(typeof req.body.color !== 'string') return res.status(404).send('you must send color property as string');
	}
	if(req.body.description !== undefined) {
		if(typeof req.body.description !== 'string') return res.status(404).send('you must send description property as string');
	}
	if(req.body.stockCount !== undefined) {
		if(typeof req.body.stockCount !== 'number') return res.status(404).send('you must send stockCount property as number');
	}
	if(req.body.expirationDate !== undefined) {
		if(isNaN(new Date(req.body.expirationDate).getTime())) return res.status(404).send('you must send valid expirationDate property as Date like this 1/7/2021');
	}
	for(var i = 0; i < products.length; i++) {
		if(products[i]['code'] == req.body.code) return res.status(404).send('you must send unique code');
	}
	var product = {
		id: products[products.length - 1]['id'] + 1,
		name: req.body.name,
		rawPrice: req.body.rawPrice,
		price: req.body.price,
		code: req.body.code,
		color: req.body.color,
		categoryid: req.body.categoryid,
		description: req.body.description,
		stockCount: req.body.stockCount,
        expirationDate: req.body.expirationDate === undefined ? req.body.expirationDate : new Date(req.body.expirationDate)
	};
	products.push(product);
	fs.writeFileSync(path.join(__dirname, 'Product.json'), JSON.stringify(products));
	res.send(product);
});
app.put('/api/products/:id', function(req: Request, res: Response) {
	var product = products.find(function(c) {
		return c.id === parseInt(req.params.id);
	});
	if(!product) return res.status(404).send('The Category with the given ID is not found');
	else if(typeof req.body.name !== 'string' || req.body.name === undefined) {
		return res.status(404).send('you must send name property as string');
	} else if(typeof req.body.rawPrice !== 'number' || req.body.rawPrice === undefined) {
		return res.status(404).send('you must send rawPrice property as number');
	} else if(typeof req.body.price !== 'number' || req.body.price === undefined || req.body.price <= 0 || req.body.price < req.body.rawPrice) {
		return res.status(404).send('you must send price property as number, grater than 0 and grater than rawPrice');
	} else if(typeof req.body.code !== 'string' || req.body.code === undefined || req.body.code.length !== 12 || req.body.code.substring(0, 3) !== req.body.code.substring(0, 3).toUpperCase() || req.body.code.charAt(3) !== '-' || req.body.code.substring(4, 7) !== req.body.code.substring(4, 7).toLowerCase() || req.body.code.charAt(7) !== '-' || isNaN(+req.body.code.substring(8, 12))) {
		return res.status(404).send('you must send code property as string and consist of 12 char and the format like this ABC-abc-1234');
	} else if(req.body.categoryid === undefined) {
		return res.status(404).send('you must send categoryid');
	}
	if(req.body.color !== undefined) {
		if(typeof req.body.color !== 'string') return res.status(404).send('you must send color property as string');
	}
	if(req.body.description !== undefined) {
		if(typeof req.body.description !== 'string') return res.status(404).send('you must send description property as string');
	}
	if(req.body.stockCount !== undefined) {
		if(typeof req.body.stockCount !== 'number') return res.status(404).send('you must send stockCount property as number');
	}
	if(req.body.expirationDate !== undefined) {
		if(isNaN(new Date(req.body.expirationDate).getTime())) return res.status(404).send('you must send valid expirationDate property as Date like this 1/7/2021');
	}
	for(var i = 0; i < products.length; i++) {
		if(products[i]['code'] == req.body.code) return res.status(404).send('you must send unique code');
	}
	product.name = req.body.name;
	product.rawPrice = req.body.rawPrice;
	product.price = req.body.price;
	product.code = req.body.code;
	product.color = req.body.color;
	product.categoryid = req.body.categoryid;
	product.description = req.body.description;
	product.stockCount = req.body.stockCount;
	product.expirationDate= req.body.expirationDate === undefined ? req.body.expirationDate : new Date(req.body.expirationDate)
	fs.writeFileSync(path.join(__dirname, 'Product.json'), JSON.stringify(products));
	res.send(product);
});
app.delete('/api/products/:id', (req: Request, res: Response) => {
	const product = products.find(c => c.id === parseInt(req.params.id));
	if(!product) return res.status(404).send('The Category with the given ID is not found')
	else {
		const index: number = products.indexOf(product);
		products.splice(index, 1)
		fs.writeFileSync(path.join(__dirname, 'Product.json'), JSON.stringify(products))
		res.send(product)
	}
})
app.listen(PORT, () => console.log(`Server Running on port: http://localhost:${PORT}`))