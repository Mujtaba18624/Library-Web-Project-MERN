import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { getToken } from "../Utils/Common";
import useTable from '../Admin_Components/useTable';
import { makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Input from '../Admin_Components/Input';
import ResponsiveDialog3 from '../Admin_Components/Popup_m_o_i'


const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(0),
        padding: theme.spacing(2)
    },
    searchInput: {
        width: '50%',
        marginLeft: '837px',
        marginBottom: "20px"
    }
}))

const headCells = [
    { id: 'Order_ID', label: 'Order ID' },
    { id: 'Order_Date', label: 'Date' },
    { id: 'Total_Price', label: 'Total Price' },
    { id: 'Status', label: 'Status' },
    { id: 'View', label: 'View' }

]
const OrderHistory = (props) => {
    const [myOrders, setmyOrders] = useState(JSON.parse(sessionStorage.getItem('myOrders')));
    const [loading, setLoading] = useState(false);
    const token = getToken();
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const classes = useStyles();

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            let config = {
                headers: {
                    Authorization: "basic " + token
                }
            }
            await axios.get('http://localhost:4000/users/getOrdersCustomer', config, {
            }).then(async response => {
                setmyOrders(response.data.data.message.info);
                sessionStorage.setItem('myOrders', JSON.stringify(response.data.data.message.info));
                setLoading(false);
                //window.location.assign('/manager/Books');

            }).catch(error => {

            });

        };

        fetchOrders();
    }, []);


    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting,
    } = useTable(myOrders, headCells, filterFn);

    const handleSearch = e => {
        let target = e.target;
        console.log(target.value);
        setFilterFn({
            fn: items => {
                if (target.value == "")
                    return items;
                else{
                    return items.filter(x => x.Order_ID.toString().includes(target.value.toString()))
                }
                }
        })
    }
    return (
        <div>
            <div className='container mt-5'>

                <h1 className='text-primary mb-3'>Orders</h1>

                <Toolbar>
                    <div className='inp'><Input
                        className={classes.searchInput}
                        placeholder="Search Order ID"
                        InputProps={{
                            startAdornment: (<InputAdornment position='start'>
                                <Search />
                            </InputAdornment>)
                        }}
                        onChange={handleSearch}
                    /></div>
                </Toolbar>


                <nbsp></nbsp>
                <TblContainer>
                    <TblHead />
                    <TableBody>
                        {recordsAfterPagingAndSorting().map(item => (
                            <TableRow key={item.Order_ID}>
                                <TableCell> {item.Order_ID} </TableCell>
                                <TableCell> {item.Order_Date} </TableCell>
                                <TableCell> {item.Total_Price} </TableCell>
                                <TableCell> {item.Status} </TableCell>

                                <TableCell>
                                    <ResponsiveDialog3
                                        Order_ID={item.Order_ID}

                                    />
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </TblContainer>
                <br />
                <TblPagination />
            </div>
        </div>
    )
}

export default OrderHistory;
