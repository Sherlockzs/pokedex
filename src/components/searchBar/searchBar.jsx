import './searchBar.css'
import { AiOutlineSearch } from "react-icons/ai";
import { useEffect, useState } from "react"
import axios from "axios"
import { func } from 'prop-types';
import { useNavigate } from 'react-router';


export function SearchBar({loadingDiv}){
    const navigate = useNavigate()
    const [details, setDetails] = useState([])
    const [FilteredDetails, setFilteredDetails] = useState([])

    function handleFilter(event){
        event.preventDefault()
         const target = event.target.value
         const newFilter = details.filter(value => {
            return value.name.toLowerCase().includes(target.toLowerCase())
         })

         if(target === ""){
            setFilteredDetails([])
         }else{
            setFilteredDetails(newFilter)
         }
    }

    function handleSearch (event) {
        const pokeNameData = event.target.getAttribute('poke-names')
        navigate("/pokemon", {state: pokeNameData})
    }

    useEffect(() => {
        if(details.length <= 0){
            const pokeArray = []
            axios.get(`https://pokeapi.co/api/v2/pokemon?limit=-1`)
            .then(resp => {
                const results = resp.data.results
                const urlList = Object.keys(results).map(item => {return resp.data.results[item]})
                const urlPromisses = urlList.map(url => {return axios.get(url.url)})
                Promise.all(urlPromisses).then((urls) => {urls.map(urlPromissed => {
                    pokeArray.push({name: urlPromissed.data.name, image: urlPromissed.data.sprites.front_default})
                    setDetails(...details, pokeArray)
                })}).finally(() => {
                    loadingDiv && loadingDiv.current.remove()
                })
            })
         }
    }, [])

    return (
        <>
        <div className="searchContainer">
            <input type="text" name="" className="search-bar" onChange={handleFilter}/>
            <i><AiOutlineSearch className='search-icon'/></i>
        </div>
        {
            FilteredDetails.length !== 0 &&(
            <div className="searchBarData">
                {FilteredDetails.slice(0, 50).map((searchItem) => (
                    <div poke-names={searchItem.name} onClick={handleSearch} key={searchItem.name} className="searchHistory">
                        <img className="pokeImages" src={searchItem.image} alt="" />
                        <div className="pokeNames">{searchItem.name}</div>
                    </div>
                ))}
            </div>)
        }
        
        </>
    )
        
        
}
