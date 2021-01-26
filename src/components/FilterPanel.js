
import React, {useState} from "react"
import Delete from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import React, { Component } from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
export default function FilterPanel(){

    const [open, setOpen] = useState(false)
    const [queries, setQueries] = useState([])
    const closePanel = (e) => {
        setOpen(false);
    };

    return (
        <Drawer
            variant="persistent"
            classes={{ paper: classes.drawer }}
            anchor="right"
            open={isOpen}
            width={this.props.width}
            onClose={closePanel}
        >
            {queries.map(x => {

            })}
        </Drawer>
    );
}