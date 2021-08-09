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
interface Category {
	id: any;
	name: string;
}
const categories: Category[] = JSON.parse(fs.readFileSync(path.join(__dirname, 'Categories.json'), 'utf-8'))
app.get('/api/categories', (req: Request, res: Response) => {
	res.send(categories)
})
app.get('/api/categories/:id', (req: Request, res: Response) => {
	const category = categories.find(c => c.id === req.params.id);
	if(!category) return res.status(404).send('The Category with the given ID is not found')
	else res.send(category)
})
app.post('/api/categories', function(req: Request, res: Response) {
	if(typeof req.body.name !== 'string' || req.body.name === undefined) {
		return res.status(404).send('you must send name property as string');
	}
	for(var i = 0; i < categories.length; i++) {
		if(categories[i]['id'] == req.body.id) return res.status(404).send('you must send unique id');
	}
	for(var i = 0; i < categories.length; i++) {
		if(categories[i]['name'] == req.body.name) return res.status(404).send('you must send unique name');
	}
	var category = {
		id: req.body.id,
		name: req.body.name
	};
	categories.push(category);
	fs.writeFileSync(path.join(__dirname, 'Categories.json'), JSON.stringify(categories));
	res.send(category);
});
app.put('/api/categories/:id', function(req: Request, res: Response) {
	var category = categories.find(function(c) {
		return c.id === req.params.id;
	});
	if(!category) return res.status(404).send('The Category with the given ID is not found');
	else if(typeof req.body.name !== 'string' || req.body.name === undefined) {
		return res.status(404).send('you must send name property as string');
	} else {
		for(var i = 0; i < categories.length; i++) {
			if(categories[i]['name'] == req.body.name) return res.status(404).send('you must send unique name');
		}
		category.name = req.body.name;
		fs.writeFileSync(path.join(__dirname, 'Categories.json'), JSON.stringify(categories));
		res.send(category);
	}
});
app.delete('/api/categories/:id', (req: Request, res: Response) => {
	const category = categories.find(c => c.id === req.params.id);
	if(!category) return res.status(404).send('The Category with the given ID is not found')
	else {
		const index: number = categories.indexOf(category);
		categories.splice(index, 1)
		fs.writeFileSync(path.join(__dirname, 'Categories.json'), JSON.stringify(categories))
		res.send(category)
	}
})
app.listen(PORT, () => console.log(`Server Running on port: http://localhost:${PORT}`))