
import React, { useState, useEffect, memoize } from 'react';
import ProductService from "../api/ProductService"
import ShopsService from "../api/ShopService"
import TextField from '@material-ui/core/TextField';
import { isEqual } from "lodash";
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import {isMobile} from "react-device-detect"
import {
    usePositioner,
    useResizeObserver,
    useContainerPosition,
    MasonryScroller, Masonry, useInfiniteLoader
} from 'masonic'
import "../styles/ProductGrid.scss"
import { Button } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
export default function ProductGrid() {
    const [products, setProducts] = useState([])
    const [shops, setShops] = useState([])
    const [pageSettings, setPageSettings] = useState({
        page: 2,
        stop: false
    });
    const [filters, setFilters] = useState({
        shops: []
    })
    const getSearch = () => {
        const storageValue = localStorage.getItem('search');
        const search2 = (storageValue && storageValue != "null") ? storageValue : "гречана крупа";
        return search2;
    }

    const [search, setSearch] = useState(getSearch())
    const searchInputRef = React.createRef();
    const reload = () => {
        const filters = JSON.parse(localStorage.getItem("filters") || "{}")
        let shops = null;
        if(filters && filters != "null" && filters.shops){
            shops = filters.shops;
            setFilters({
                shops: shops
            });
        }
        new ProductService().get(shops, search).then(res => setProducts(res.sort(sortResolver)))
        new ShopsService().getAll().then(res => setShops(res))
    }

    const sortResolver = (first, second) => {
        return calcEffectivePrice(first) - calcEffectivePrice(second);
    }

    const calcEffectivePrice = (data) => {
        return data.unit === "kg" ? data.price / 1000 : data.price / data.weight;
    }

    const clearStorage = () => {
        localStorage.clear()
    }
    useEffect(reload, [])
    useEffect(reload, [search])
    useEffect(clearStorage, [products])

    const handleSearchSubmit = (e) => {
        localStorage.setItem('search', searchInputRef.current.value);
        document.location.reload();
    }

    const fetchMoreItems = (startIndex, stopIndex, currentItems) => {
        if (!pageSettings.stop) {
            setPageSettings((prev) => {
                return {
                    stop: true,
                    page: prev.page
                }
            });
            new ProductService().get(null, search, pageSettings.page).then(nextItems => {
                if (nextItems.length > 0) {
                    setPageSettings((prev) => {
                        return {
                            stop: false,
                            page: prev.page + 1
                        }
                    });
                    setProducts((current) => {
                        return [...current, ...nextItems]
                    })
                }
            });
        }
    }
    const addShopFilter = (value) => {
        setFilters((prev) => {
        
            const index = prev.shops.indexOf(value);
            if(index > -1){
                prev.shops.splice(index, 1)
                return {
                    shops: [...prev.shops]
                }
            }
            return {
                shops: [...prev.shops, value]
            }
        })
    }

    const saveFilters = () => {
        localStorage.setItem("filters", JSON.stringify(filters));
        document.location.reload();
    }

    return (
        <div style={isMobile ? {} : {"display": "flex"}}>

            <div className={"filterContainer"}>
                <div className={"searchContainer"}>
                    <TextField
                        id="standard-read-only-input"
                        label="Назва товару"
                        defaultValue={search}
                        inputRef={searchInputRef}
                    />
                    <IconButton onClick={handleSearchSubmit}>
                        <SearchIcon />
                    </IconButton>
                </div>
                <List className={"shops-list-filter"}>
                    {
                        shops.map(x => {
                            return (
                                <ListItem key={x.title} classes={{root: "list-item"}} dense button onClick={addShopFilter.bind(this, x.name)}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={filters["shops"]?.indexOf(x.name) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={x.title} />
                                </ListItem>
                            )
                        })
                    }
                </List>

                <IconButton onClick={saveFilters} classes={{root: "apllyFilters"}}>
                    <div>Застосувати фільтри</div>
                </IconButton>
            </div>

            <ProductMasonry products={products} search={search} fetchMoreItems={fetchMoreItems} shops={shops} />

        </div>
    )
}

const ProductMasonry = ({ products, search, fetchMoreItems, shops }) => {

    const getMassa = (item) => {
        return item.unit === "kg" ? "1 кг" : `${item.weight} грамм`;
    }

    const renderElement = ({ data, width }) => {
        return (
            <div className="product">
                <a href={data.url} style={{ "color": "white" }}>
                    <img width={width} src={data.thumbnail} />
                    <div class="info">
                        <div>
                            {data.title}
                        </div>
                        <div>
                            {getMassa(data)}
                        </div>
                        <div style={{"display": "flex", "justifyContent": "center"}}>
                            <div style={{"marginRight": "10px"}}>
                                [{shops.find(x=>x.name === data.shop).title}]
                            </div>
                            <div>
                            {`${data.price || data.old_price} грн `}
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        );
    }
    const maybeLoadMore = useInfiniteLoader(fetchMoreItems, { minimumBatchSize: 0, threshold: 1, isItemLoaded: (index, items) => !!items[index] });
    return (
        <Masonry
            className={'product-list-container'} // default ''
            onRender={maybeLoadMore}
            render={renderElement}
            items={products}
            columnGutter={8}
            key={search}
        >
        </Masonry>
    );
}