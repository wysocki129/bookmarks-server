// Required dependencies
const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');
const { bookmarks } = require('../store');

// bookmarks-router setup
const bookmarksRouter = express.Router();
const bodyParser = express.json();

bookmarksRouter
	.route('/bookmarks')
	.get(handleGetBookmarks)
	.post(bodyParser, handlePostNewBookmark);

function handleGetBookmarks(req, res) {
	res.json(bookmarks);
}

function handlePostNewBookmark(req, res) {
	const { title, url, description, rating } = req.body;

	if (!title) {
		logger.error('Title is required');
		return res.status(400).send('Invalid data, bookmark must have title');
	}

	if (!url) {
		logger.error('url is required');
		return res.status(400).send('Invalid data, bookmark must have url');
	}

	if (!description) {
		logger.error('description is required');
		return res.status(400).send('Invalid data, bookmark must have description');
	}

	if (!rating) {
		logger.error('rating is required');
		return res.status(400).send('Invalid data, bookmark must have rating');
	}

	const id = uuid();
	const newBookmark = {
		id,
		title,
		url,
		description,
		rating
	};

	bookmarks.push(newBookmark);

	logger.info(`Bookmark with id ${id} created`);

	res.status(201)
		.location(`http://localhost:8000/bookmarks/${id}`)
		.json(newBookmark);
}

bookmarksRouter
	.route('/bookmarks/:id')
	.get(handleGetBookmarkWithId)
	.delete(handleDeleteBookmarkWithId);

function handleGetBookmarkWithId(req, res) {
	const { id } = req.params;
	const bookmark = bookmarks.find(bookmark => bookmark.id == id);

	if (!bookmark) {
		logger.error(`Bookmark with id ${id} not found`);
		return res.status(404).send('Bookmark Not Found');
	}

	res.json(bookmark);
}

function handleDeleteBookmarkWithId(req, res) {
	const { id } = req.params;

	const bookmarkIndex = bookmarks.findIndex(bm => bm.id == id);

	if (bookmarkIndex === -1) {
		logger.error(`Could not find bookmark with id ${id}`);
		return res.status(404).send('bookmark not found');
	}

	bookmarks.splice(bookmarkIndex, 1);

	logger.info(`Deleted bookmark with id ${id}`);

	res.status(204).end();
}

module.exports = bookmarksRouter;
