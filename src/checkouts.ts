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
type guid = string & {
	isGuid: true
};

function guid(guid: string): guid {
	return guid as guid;
}
interface productInfo {
	productid: number;
	unitPrice: number;
	quantity: number;
	subtotal: number
}
interface Checkout {
	id: guid;
	date: Date;
	products: productInfo[];
	total: number;
	discount: number;
	paymentAmount: number
}
const checkouts: Checkout[] = JSON.parse(fs.readFileSync(path.join(__dirname, 'Checkouts.json'), 'utf-8'));
app.post('/api/checkouts', function(req: Request, res: Response) {
	if(req.body.id === undefined) {
		return res.status(404).send('you must send id as string');
	} else if(req.body.date === undefined || isNaN(new Date(req.body.date).getTime())) {
		return res.status(404).send('you must send valid date property as Date like this 1/7/2021');
	} else if(typeof req.body.total !== 'number' || req.body.total === undefined) {
		return res.status(404).send('you must send total property as number');
	} else if(typeof req.body.discount !== 'number' || req.body.discount === undefined) {
		return res.status(404).send('you must send discount property as number');
	} else if(typeof req.body.paymentAmount !== 'number' || req.body.paymentAmount === undefined) {
		return res.status(404).send('you must send paymentAmount property as number');
	}
	for(var j = 0; j < req.body.products.length; j++) {
		if(typeof req.body.products[j].productid !== 'number' || req.body.products[j].productid === undefined) {
			return res.status(404).send('you must send productid property as number');
		} else if(typeof req.body.products[j].unitPrice !== 'number' || req.body.products[j].unitPrice === undefined) {
			return res.status(404).send('you must send unitPrice property as number');
		} else if(typeof req.body.products[j].quantity !== 'number' || req.body.products[j].quantity === undefined) {
			return res.status(404).send('you must send quantity property as number');
		}
	}
	for(var i = 0; i < checkouts.length; i++) {
		if(checkouts[i]['id'] == req.body.id) return res.status(404).send('you must send unique id');
	}
	var produtsArr: productInfo[] = [];
	for(let i = 0; i < req.body.products.length; i++) {
		produtsArr[i] = {
			productid: req.body.products[i].productid,
			unitPrice: req.body.products[i].unitPrice,
			quantity: req.body.products[i].quantity,
			subtotal: req.body.products[i].unitPrice * req.body.products[i].quantity
		}
	}
	var checkout: Checkout = {
		id: guid(req.body.id),
		date: new Date(req.body.date),
		products: produtsArr,
		total: req.body.total,
		discount: req.body.discount,
		paymentAmount: req.body.paymentAmount
	};
	checkouts.push(checkout);
	fs.writeFileSync(path.join(__dirname, 'Checkouts.json'), JSON.stringify(checkouts));
	res.send(checkout);
});
app.listen(PORT, () => console.log(`Server Running on port: http://localhost:${PORT}`))