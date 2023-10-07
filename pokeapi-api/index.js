const superagent = require('superagent');

const config = require("./config.json");

/**
 * The module must export a function that allows for searching the selected API by keyword.
Given a search keyword or term this function should return an array that represent the result list (more than one item).
(EX: game title, city, character, actor/actress or artist)
Search

 */
const searchMon = async (query = "") =>
{
    try
    {
        const url = `${config.search}${query}`;
        const response = await superagent.get(url);

        return response.body;
    }
    catch(error)
    {
        // console.log(error);
        return error;
    }
}

/**
 * The module must export a function for getting details from the selected API by some unique identifier (id).
Given an id or some unique identifier, this function should return detailed data about that one item.
(EX: details on a game, restaurants in a city, facts/stats on character, resume of an actor/actress or artist)
Get

 */

const dataById = async (id = 0, query = "ability") =>
{
    try
    {
        const url = `${config.get}/${query}/${id}`;
        const response = await superagent.get(url);
        return response.body;
    }
    catch(error)
    {
        return error;
    }
}

module.exports = {
    searchMon,
    dataById
};