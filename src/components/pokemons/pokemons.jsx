import { useNavigate } from 'react-router-dom';
import "./pokemons.css"

export function Pokemons({data, elementData}){
    const navigate = useNavigate()

    const pokeName = data.data.species.name
    const pokeNameCapitalized = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);
    const type1 = data.data.types[0] && data.data.types[0].type.name
    const type2 = data.data.types[1] && data.data.types[1].type.name

    if(!data){
        return <></>
    }

    function handleClick(event){
        const pokeNameData = event.target.getAttribute('poke-data')
        navigate("/pokemon", {state: pokeNameData})
    }

    return(
        <div onClick={handleClick} poke-data={elementData} className="poke-frame">
            <img alt="poke-img" className="poke-img" src={data.data.sprites.front_default}></img>
            <div className="poke-names">{pokeNameCapitalized}</div>
            <div className="type-container">
                {data.data.types[0] && <div className="type-one">{type1}</div>}
                {data.data.types[1] && <div className="type-two">{type2}</div>}
            </div>
        </div>
    )
}