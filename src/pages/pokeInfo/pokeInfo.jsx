import './pokeInfo.css'
import { useLocation } from 'react-router-dom';
import { NavigationBar } from '../../components/navigationBar/navigationBar';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';


export function PokeInfo(){
    const { state } = useLocation();
    const pokeInfoRef = useRef()
    const selectedRef = useRef()
    const [infoPoke, setInfoPoke] = useState({})
    const [evolutionInfo, setEvolutionInfo] = useState([])
    const [lastPoke, setLastPoke] = useState()
    const [mainPoke, setMainPoke] = useState()


    function getFilteredKeys(obj, filter) {
        let keys = [];
        for (let key in obj) {
          if (key === filter) {
            keys.push(key);
          }
          else if (typeof obj[key] === 'object') {
            let nestedKeys = getFilteredKeys(obj[key], filter);
            keys = keys.concat(nestedKeys.map(nestedKey => key + '.' + nestedKey));
          }
        }
        return keys;
    }

    function fetchEvoChain(){
        axios.get(`https://pokeapi.co/api/v2/pokemon/${state}`)
        .then(result =>{ 
            const url = result.data.species.url
            axios.get(url).then(specie => {
                return specie.data.evolution_chain.url
            })
            .then((evoChainUrl) => {
                axios.get(evoChainUrl)
                .then((evoChain) => {
                    const filterKeys = getFilteredKeys(evoChain, "species")
                    const res =  filterKeys.map(keys => {return axios.get(`https://pokeapi.co/api/v2/pokemon/${keys.split('.').reduce(function(o, k) {return o && o[k];}, evoChain).name}`);})
                    Promise.all(res)
                    .then(resp => {
                        setEvolutionInfo(resp.reverse())
                        setMainPoke(result.data)
                    })
                })
            })
        })
    }

    function handleClick(event){
        if(lastPoke && lastPoke !== event.target){
            lastPoke.classList.remove("selected")
        }
        if(document.querySelector(".selected") && document.querySelector(".selected").getAttribute("pokedata") === state){
            document.querySelector(".selected").classList.remove("selected")
        }
        setInfoPoke(event.target.getAttribute("pokejson"))
        setLastPoke(event.target)
        event.target.className += " selected" 
    }

    useEffect(() => {
        fetchEvoChain()
        
    }, [])

    return(
        <div className="pokeContainer">
            <div className="pokeNavbat">
                <NavigationBar/>
            </div>
            <div className="pokemonsContent">
                <div ref={pokeInfoRef} className="pokeInfo"> 
                    <div ref={selectedRef} className="selectPoke">
                        {evolutionInfo && evolutionInfo.map(evo => (
                            <div draggable="false" pokejson={JSON.stringify(evo.data)} pokedata={evo.data.name} onClick={handleClick} key={evo.data.name} className={evo.data.name === state ? "pokes selected" :  "pokes"}>
                                <img alt={evo.data.name} className='pokeimg' src={evo.data.sprites.front_default}/>
                            </div>
                        ))}
                    </div>
                    <div className="pokeInformations">
                        {infoPoke && <LoadInfo loadedPoke={mainPoke} ClickedPoke={infoPoke && infoPoke}/>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function LoadInfo({ClickedPoke, loadedPoke}){

    function isValidJson(json){
        try {
            return  JSON.parse(json);
        }catch (err) {
            return false
        }
    }

    const obj = isValidJson(ClickedPoke)
    console.log(obj.name);
    if(loadedPoke && !obj){
        return(
            <div className='pokeInfoContainer'>
                <span className="pokeInfoName">{loadedPoke.name}</span>
                <img className='pokeimg' src={loadedPoke.sprites.front_default} alt="" />
            </div>

        )
    }

    if(!obj){
        return(
            <div className="lds-hourglass-video"></div>
        ) 
    }

    return(
        <div className='pokeInfoContainer'>
            <span className="pokeInfoName">{obj.name}</span>
            <img className='pokeimg' src={obj.sprites.front_default} alt="" />
        </div>
    )
}