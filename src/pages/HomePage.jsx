import React from "react";
import ItemsList from "../components/ItemsList.jsx";
import Checkbox from "../components/Checkbox.jsx";
import PropTypes from "prop-types";
import SortDropdown from "../components/SortDropdown.jsx";
import "./homepage.css";

class HomePage extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            sortDirection: -1,
            items: [],
            allCategories: ["fairylights", "dreamcatchers"],
            selectedCategories: ["fairylights"],
        };
    }

    componentDidMount(){
        this.fetchItems();
    }

    fetchItems = () => {
        fetch("/api/v1/items")
        .then(res => {
            console.log("res", res);
            return res.json();
        })
        .then(items => {
            console.log("items", items);
            this.setState({
                items
            });
        })
        .catch(err => {
            console.log("err", err);
        });
    };

    handleDropdown = (event) => {
        if(this.isSelected(event.target.name)){
            const clone = this.state.selectedCategories.slice();
            const index = this.state.selectedCategories.indexOf(event.target.name);
            clone.splice(index, 1);
            this.setState({
                selectedCategories: clone
            });
        }
        else {
            this.setState({
                selectedCategories: this.state.selectedCategories.concat([event.target.name])
            });
        }
    }

    getVisibleItems = () => {
        return this.state.items
        .filter(item => this.isSelected(item.category))
        .sort((a, b) => {
            switch (this.state.sortDirection){
                case -1: return b.price - a.price;
                case 1: return a.price - b.price;
            }
        });
    }

    isSelected = (name) => this.state.selectedCategories.indexOf(name) >= 0;

    handleSortDropdown = (event) => {
        this.setState({
            sortDirection: parseInt(event.target.value),
        });
    } 

    render(){
        const visibleItems = this.getVisibleItems();
        return (
            <>
                    <div className={"body-wrapper"}>
                        <div className={"filters-wrapper"}>
                            <CategoriesFilter 
                                allCategories={this.state.allCategories}
                                handleDropdown={this.handleDropdown}
                                isSelected={this.isSelected}
                            />
                        </div>
                        <div className={"items-header-wrapper"}>
                            <div>
                                {visibleItems.length} items found for {this.state.selectedCategories.join(", ")}
                            </div>
                            <SortDropdown direction = {this.state.sortDirection} onChange = {this.handleSortDropdown} />
                    </div>
                    <ItemsList items={visibleItems}/>
                </div>
            </>
        );
    }
}

const CategoriesFilter = ({allCategories, handleDropdown, isSelected}) => {
    return (
        <>
            {
                allCategories.map(categoryName => {
                    return (
                        <Checkbox 
                            key={categoryName} 
                            name={categoryName} 
                            onChange={handleDropdown} 
                            checked={isSelected(categoryName)}
                        />
                    );
                })
            }
        </>
    );
};
CategoriesFilter.propTypes = {
    allCategories: PropTypes.array.isRequired,
    handleDropdown: PropTypes.func.isRequired,
    isSelected: PropTypes.func.isRequired,
};

export default HomePage;