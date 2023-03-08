import "./home.css"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { NavigationBar} from "../../components/navigationBar/navigationBar.jsx"
import { Pokemons } from "../../components/pokemons/pokemons.jsx"

export function Home(){
    const PAGE_NUMBER = 45
    const [pokeList, setPokeList] = useState([])
    const [pokeLimit, setPokeLimit] = useState(PAGE_NUMBER)
    const [loading, setLoading] = useState(true)
    const [details, setDetails] = useState(null)
    const intersectDiv = useRef()
    const loadingDiv = useRef()

    useEffect(() => {
        const intersectObserver = new IntersectionObserver((entries) => {
            if(entries.some((entry) => entry.isIntersecting)){
                setPokeLimit((pokeLimitInsideState) => pokeLimitInsideState + PAGE_NUMBER)
                setLoading(true)
            }
        })  
        
        intersectObserver.observe(intersectDiv.current);
        return () => intersectObserver.disconnect()
    }, [])

    useEffect(() => {
        axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${pokeLimit}`)
        .then(resp => {
            setPokeList(resp.data.results)
        })
    }, [pokeLimit])

    useEffect(() =>{
        const urlArray = pokeList.map((item) => {
            return axios.get(item.url)
        })
        Promise.all(urlArray).then((urls) => {setDetails(urls)})
        setLoading(false)
    }, [pokeList])


    return(
        <div className="home-container">
            <div className="home-navbar">
                <NavigationBar loadingDivRef={loadingDiv}/>
            </div>
            <div className="pokemon-content">
            <div ref={loadingDiv} className="lds-hourglass-video"></div>
                <div className="pokemons">
                    {details ? details.map(item => (
                        <Pokemons elementData={item.data.name} key={item.data.name} data={item}/>
                    )): loading && "Loading..."}
                </div>
            </div>
            <div ref={intersectDiv} className="intersect"></div>
        </div>
    )
}