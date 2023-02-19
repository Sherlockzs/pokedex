
.then((species) => {
    axios.get(evolutionUrl).then(chain => {
    
    
    console.log(evoList);
    return evoList
}).then((list) => {
    const pokeList = []
    list.map(poke => {
        axios.get(`https://pokeapi.co/api/v2/pokemon/${poke.name}`).then(getPoke => pokeList.push(getPoke))
    })
    return pokeList
})
})