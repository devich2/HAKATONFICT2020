
import React, { useState, useEffect, memoize } from 'react';
import ProductService from "../api/ProductService"
import { Masonry, useInfiniteLoader } from 'masonic'
import "../styles/ProductGrid.scss"

export default function ProductGrid() {
    const [products, setProducts] = useState([])
    const [pageSettings, setPageSettings] = useState({
        page: 2,
        stop: false
    });
    const [search, setSearch] = useState("крупа")

    const reload = () => {
        new ProductService().get(null, search).then(res => setProducts(res))
    }

    useEffect(reload, [])

    const fetchMoreItems = (startIndex, stopIndex, currentItems) => {
        if (!pageSettings.stop) {
            setPageSettings((prev) =>{
                return {
                    stop: true,
                    page: prev.page
                }
            });
            new ProductService().get(null, search, pageSettings.page).then(nextItems => {
                if (nextItems.length > 0) {
                    setPageSettings((prev) =>{
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

    const getMassa = (item) => {
        return item.unit === "kg" ? "1 кг" : `${item.weight} грамм`;
    }

    const renderElement = ({data, width}) => {
        return (
            <div className="product">
                <img width={width} src={data.thumbnail} />
                <div class="info">
                    <div>
                        {data.title}
                    </div>
                    <div>
                        {getMassa(data)}
                    </div>
                    <div>
                        {`${data.price || data.old_price} грн `}
                    </div>
                </div>
            </div>
        );
    }

    const maybeLoadMore = useInfiniteLoader(fetchMoreItems, {minimumBatchSize: 0, threshold: 1, isItemLoaded: (index, items) => !!items[index]});
    return (
        <div>
            {   
                <Masonry
                    className={'product-list-container'} // default ''
                    elementType={'ul'} // default 'div'
                    onRender={maybeLoadMore}
                    render={renderElement}
                    items={products}
                >
                </Masonry>
            }
        </div>
    )
}