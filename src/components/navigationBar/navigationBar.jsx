import "./navigationBar.css"
import { SearchBar } from "../searchBar/searchBar"

export function NavigationBar({loadingDivRef}){
    return(
        <div>
            <nav className="nav">
                <div className="nav-container left">
                    <span>HOME</span>
                </div>
                <div className="nav-container middle">
                    <SearchBar loadingDiv={loadingDivRef}/>
                </div>
                <div className="nav-container right"></div>
            </nav>
        </div>
    )
}