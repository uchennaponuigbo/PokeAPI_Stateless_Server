const router = require("express").Router();
const pokeApi = require("pokeapi-api");

//localhost:8888/search/ability?pokemon=pikachu
router.get("/ability", async (req, res) =>
{
    try
    {
        const {pokemon = "goomy"} = req.query;
        
        const pokemonData = await pokeApi.searchMon(pokemon);
        const abilitiesAndId = _getAbilityData(pokemonData);

        const postData =
        {
            keyword: pokemon,
            resultsCount: abilitiesAndId.length,
            results: abilitiesAndId
        };

         res.json(postData);
        
    }
    catch(error)
    {
        res.status(500).json(error);
    }
});

router.post("/ability/details", async(req, res) =>
{
    try
    {
        //user data from body
        const {id, keyword, resultsCount, displayText} = req.body;
        
        let details = await pokeApi.dataById(id);
        details = _filterDetailsObject(id, details);   

        const time = new Date();
        const dbData = 
        {
            keyword,
            resultsCount,
            selectedId: id,
            displayText,
            timestamp: time.toString()
        };
 
        // insert the results into MongoDB
        const db = req.app.locals.db;
        const collection = db.collection('SearchHistory');

        await collection.insertOne(dbData);
         
        res.json(details);
    }
    catch(error)
    {
        res.status(500).json(error);
    }
});

const _getAbilityData = (pokemonData = {}) =>
{
    const arr = pokemonData["abilities"];
    const arrOfObjs = [];
    for(let i = 0; i < arr.length; i++)
    {
        const obj = {};
        const id = _getUrlIndex(arr[i].ability.url);
        obj.id = id;
        
        obj["displayText"] = arr[i].ability.name;
        
        arrOfObjs.push(obj);
    }
    return arrOfObjs;
};

//extracting id from api url. default is for .../ability/ and .../pokemon/
//coicindently have the same index position. It's a magic number, but the url
//for the ability will always be the same unless they change their website
const _getUrlIndex = (str = "", index = 34) =>
{
    /**
     * 
     * https://pokeapi.co/api/v2/ability/
     * https://pokeapi.co/api/v2/pokemon/
     */
    const url = str.substring(index);
    return parseInt(url);
};

const _filterDetailsObject = (id, details = {}, ) =>
{
    //get the description of the ability
    const arr = details["effect_entries"];
    const filteredObj = {};
    filteredObj["Id"] = id;
    filteredObj["Ability-Name"] = details.name
    
    for(let i = 0; i < arr.length; i++)
    {
        if(arr[i].language.name === "en")
        {
            filteredObj["Description"] = arr[i].effect;          
            break;
        }
    }

    const monsWithSharedAbility = [];
    const arr2 = details["pokemon"]
    for(let i = 0; i < arr2.length; i++)
    {
        /**{
         * Pokedex-id: n
         * name: ""
         * } */
        const obj = {};
        const id = _getUrlIndex(arr2[i].pokemon.url);
        obj["Pokedex-id"] = id;
        obj["Name"] = arr2[i].pokemon.name
        monsWithSharedAbility.push(obj);
    }
    Object.assign(filteredObj, {pokemon : monsWithSharedAbility})
    return filteredObj;
};

module.exports = router;