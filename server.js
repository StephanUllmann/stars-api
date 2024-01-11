import express from "express";
import morgan from "morgan";
import { getClient, query } from "./dbInit.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const port = process.env.PORT || 8080;
getClient();

// test if db is up and running
app.get("/test", async (req, res) => {
	try {
		const result = await query("SELECT NOW();");
		if (result.rowCount === 0) throw Error("There is no time");
		res.json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

let cacheAll = null;

// get all star data
app.get("/stars", async (req, res) => {
	try {
		if (cacheAll) return res.json(cacheAll);
		const result = await query("SELECT * FROM stars;");
		if (result.rowCount === 0) {
			return res.status(404).json({ error: "There are no stars" });
		}

		cacheAll = [...result.rows];
		res.json(result.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// get single element
app.get("/stars/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const result = await query("SELECT * FROM stars WHERE id=$1;", [id]);
		if (result.rowCount === 1) res.status(200).json(result.rows[0]);
		else res.status(404).json({ error: `Element not found: ${id}` });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

const invalidateCache = (req, res, next) => {
	cacheAll = null;
	next();
};

app.use(invalidateCache);

// create a new entry - and return it
app.post("/stars", async (req, res) => {
	const { heading, url, description } = req.body;
	if (!heading) res.status(422).json({ error: "Heading required" });
	if (!url) res.status(402).json({ error: "URL for image required" });
	if (!description) res.status(422).json({ error: "Description required" });
	try {
		const result = await query(
			"INSERT INTO stars (heading, url, description, featured) VALUES ($1, $2, $3, false) RETURNING *;",
			[heading, url, description],
		);
		if (result.rowCount === 1) {
			// cacheAll = null;
			const answer = {
				...result.rows[0],
				message: `Successfully created ${id} - ${heading}`,
			};
			res.status(201).json(answer);
		} else throw Error("Posting was messed up.");
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// update existing entry and return it
app.put("/stars/:id", async (req, res) => {
	const { id } = req.params;
	let { heading, url, description, featured } = req.body;
	console.log(req.body);
	heading = heading === "" ? null : heading;
	url = url === "" ? null : url;
	description = description === "" ? null : description;
	featured = featured === "" ? null : featured;

	try {
		const result = await query(
			"UPDATE stars SET heading=coalesce($1, heading), url=coalesce($2, url), description=coalesce($3, description), featured=coalesce($4, featured) WHERE id=$5 RETURNING *;",
			[heading, url, description, featured, id],
		);
		if (result.rowCount === 1) {
			// cacheAll = null;
			const answer = {
				...result.rows[0],
				message: `Successfully updated ${id} - ${heading}`,
			};
			res.status(200).json(answer);
		} else throw Error("Updating was messed up.");
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// toggle featured column of existing entry
app.put("/stars/featured/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const result = await query(
			"UPDATE stars SET featured = NOT featured WHERE id=$1 RETURNING *;",
			[id],
		);
		if (result.rowCount === 1) {
			// cacheAll = null;
			const answer = {
				...result.rows[0],
				message: `Successfully updated ${id}`,
			};
			res.status(200).json(answer);
		} else throw Error("Update was messed up.");
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// delete entry
app.delete("/stars/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const result = await query(
			"DELETE FROM stars WHERE id=$1 RETURNING heading",
			[id],
		);
		if (result.rowCount === 1) {
			// cacheAll = null;
			res.status(200).json({ message: `Deleted ${result.rows[0].heading}` });
		} else res.status(404).json({ error: `Element not found: ${id}` });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`);
});
