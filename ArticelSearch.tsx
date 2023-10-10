/* ================================================== ArticelSearch Form ==================================================
Import  modules */
import { store } from "../store";

import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Box, Button, Grid, Paper, styled, Table, TableRow, TableCell, TableHead, TableBody, TableContainer, Typography, collapseClasses } from '@mui/material';
import { setArtList, setTargetArticelObj} from '../redux/ArticelstatusSlicer';
import checkReduxStoreTree, {
  handleStateChange,
}from "@/data/StoreSubscriber";
import LoadingIndicator from "../data/LoadingIndicator";

// For formcontroll from MUI
    import FormControl from '@mui/joy/FormControl';
    import Input from '@mui/joy/Input';

// Begin to listen for Store state´s changes 
    store.subscribe(handleStateChange)
    checkReduxStoreTree("articelStatus");

var ArticelSearch = () =>{
    const [ updatedStateTree, updateUpdatedStateTree ] = useState(null);
    const [ chossenArticel, updateChossenArticel ] = useState("");

    useEffect(() => {
        // Update the store state tree width a delay of 2 sec
            setTimeout(() => {
                updatedStateTree !== checkReduxStoreTree("articelStatus") &&
                updateUpdatedStateTree(checkReduxStoreTree("articelStatus"));
            }, 2000);
            
        // Run if data is received
    }, [ updatedStateTree, chossenArticel ]);

    var searchArticel = (e: any) => {
        var currentArticelTaget: string = e.target.value;
        
        console.log(currentArticelTaget);
        var targetArticel: string = "";
        updateChossenArticel(currentArticelTaget);

        // Search for Articel by its Aricelnr. Save the matching Articel object in the store
            updatedStateTree["artList"].forEach((element: any, index: number) => {
                if(element["Item No_"] === currentArticelTaget) {
                    targetArticel = element["Item No_"];
                    var targetArticelObj: object = 
                    updatedStateTree["artList"][index];
                    console.log("targetArticelObj", targetArticelObj);

                    store.dispatch(setTargetArticelObj([targetArticelObj]));                 
                } 
            });
        
        targetArticel === "" && store.dispatch(
            setTargetArticelObj(["", "..............", "..............", ".............."]
        ));
        
    }
    console.log(chossenArticel);
    
    return(
        <FormControl>
            <Input
                sx={{ width: "150px" }}
                placeholder="................"
                type="articel"
                required
                value={chossenArticel}
                onChange={searchArticel}
            />     
        </FormControl>
    );
}
export default ArticelSearch;