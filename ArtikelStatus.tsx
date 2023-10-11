/* ================================================== Input Form ==================================================
Import  modules */
import { store } from "../store";
import { setPaginationCurrentPage, setPaginationQuentityPages} from "../redux/ArticelstatusSlicer";    

import { useSelector } from 'react-redux';
import {Helmet} from "react-helmet";

/* ================================================== ArticelStatus ==================================================
Import  modules */
import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableRow, TableCell, TableHead, TableBody, TableContainer } from '@mui/material';
import CalApiSQLData from '../data/CalApiSQLData';
import checkReduxStoreTree from "@/data/StoreSubscriber";
import LoadingIndicator from "../data/LoadingIndicator";
import ArticelSearch from "../data/ArticelSearch";

// For pagination from MUI
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Begin to listen for Store state´s changes 
    //store.subscribe(handleStateChange);
    
var ArticelStatus = () =>{
    //store.subscribe(handleStateChange)
    
    var storeListener: any = checkReduxStoreTree("articelStatus");
    const [ updatedStateTree, updateUpdatedStateTree ] = useState(null);
    var getStoreData: any = useSelector((state: any) => state["articelStatus"]);

    const [ isDataReceived, updateIsDataReceived ] = useState(false);
    // 
    const [ currentPage, updateCurrentPage ] = useState(1);
    const [ quentityPages ] = useState(20); 
   
    const [ indexStartInterval, updateIndexStartInterval] = useState(0);
    const [ indexEndInterval, updateIndexEndInterval] = useState(0);
    const [ articelList, updateArticelList ] = useState([]);
    const [ targetArticelObj, updateTargetArticelObj ] = useState([]);

    // Change the articel object acording the pages you have selected. The first time is always page 1 
        const [ changeArticelList, updateChangeArticelList ] = useState((articelData: Array<object>, choosenPage: number ) => {
            console.log('changeArticelList --> ChoosenPage :', choosenPage);
            var startIndex: number = indexStartInterval*choosenPage;
            var endIndex: number = indexEndInterval*choosenPage;
            
            var shorterArticelList: Array<object> = articelData.slice(startIndex, endIndex);
            console.log('ShorterArticelList : \n', shorterArticelList, 'StartIndex: ', indexStartInterval, '\n endIndex: ', indexEndInterval);
            updateArticelList(shorterArticelList);
        }
    )
    useEffect(() => {       
        // Update the store state tree with a delay of 2 sec to give the data to be updated before the can components handle it
        setTimeout(() => {
            if(updatedStateTree !== storeListener){
                //console.log('storeListener :', storeListener);
                updateUpdatedStateTree(storeListener);
                console.log(updatedStateTree); 
                updateTargetArticelObj(storeListener["targetArticelObj"]);
            }
        }, 1000);
        
        // Run if data is not received 
            if(storeListener["isDataReceived"] === false) {
                CalApiSQLData();
                store.dispatch(setPaginationQuentityPages(quentityPages));
                updateIsDataReceived(true);
            }
        // Run if data is received
            if(updatedStateTree !== null && updatedStateTree["artList"].length > 0){
                updateChangeArticelList(updatedStateTree["artList"], 1);
                indexEndInterval === 0 && updateIndexEndInterval(updatedStateTree.paginationValue["quentityPages"]);
            }
    }, [ storeListener, updatedStateTree, currentPage, indexStartInterval, indexEndInterval, quentityPages, changeArticelList]);
    

    // Run when you are changing page     
        const onChangePage = (choosenPage: number) => {
            // Index interval to show eatch pages
                
            if(choosenPage > currentPage){
                console.log('ChoosenPage +:', choosenPage);
                runPage(choosenPage);
            }
            if(choosenPage < currentPage){
                console.log('ChoosenPage -:', choosenPage);
                runPage(choosenPage);
            }
        }
        var runPage = (page: number) => {
            var countStartIndex: number = page*quentityPages-quentityPages;
            var countEndIndex: number = page*quentityPages;
            
            store.dispatch(setPaginationCurrentPage(page));
            changeArticelList(updatedStateTree["artList"], page)
            updateCurrentPage(page);
            updateIndexStartInterval(countStartIndex);
            updateIndexEndInterval(countEndIndex);
        }
    
    // Counting the articel tot 
        var getArticelTot = (objKey: string) => {
            var objValuesArr: Array<object> = [];
            console.log(objKey);
            if(updatedStateTree !== null){
                var sum: any = 0;
                var objKeyValuesObj: Array<object> = updatedStateTree["artList"];
                objKeyValuesObj.map((item: any) => objValuesArr.push(item[objKey]));
                for (let i = 0; i < objValuesArr.length; i++ ) {
                    sum += objValuesArr[i];
                }
                return sum;                 
            }
        }
    //Update the articel List by rerunning a DB request
        var getNewData = () => {CalApiSQLData();}
    
    console.log(storeListener);
    
    return(
        <>
        {(updatedStateTree !== null) &&
            <Box sx={{marginLeft: "20%", width: "1100px", display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>{storeListener["appName"]}</title>
                </Helmet>
                <Box sx={{width: "90%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <Box sx={{fontSize: "30px", fontWeight: "bold"}}>{storeListener["appName"]}</Box>
                    <Box sx={{height: "42px", width: updatedStateTree.paginationValue["totPages"] === 0 ? "575px" : "549px", display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                        <Stack spacing={2}>
                            <Pagination 
                                sx={{width: updatedStateTree.paginationValue["totPages"] === 0 ? "430px" : "420px"}}
                                count={storeListener.paginationValue["totPages"]}
                                size="large"
                                onChange={onChangePage}
                                renderItem={(item: any) => (
                                    <PaginationItem
                                        slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                                        {...item}
                                    />
                                )}
                            />
                        </Stack>
                        <Box sx={{marginTop: "5px", fontSize: "20px"}}>Hantera: {storeListener["artList"].length} </Box>
                    </Box> 
                    <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <Button sx={{marginLeft: "0px"}} onClick={getNewData}>Uppdatera</Button>
                        <Box sx={{marginTop: "12px"}}>{ articelList.length === 0 && <LoadingIndicator/>}</Box>
                    </Box>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {
                                    getStoreData["headlines"].map((item: any, index: number) => {
                                        console.log(item);
                                        
                                        return(         
                                            <TableCell sx={{textAlign: "center"}} colSpan={2} key={index+item}> 
                                                {(index === 0)
                                                    ?   
                                                        <Box sx={{width: "200px", height: "65px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                                            <Box>{item}</Box>
                                                            <Box><ArticelSearch/></Box>
                                                        </Box>
                                                    :   [
                                                            (index === 1) &&
                                                                <Box sx={{height: "65px"}}>                                                                    
                                                                    <Box>{item}</Box>
                                                                    <Box sx={{marginTop: "10px"}}>
                                                                        {targetArticelObj.length !== 1
                                                                            ?   storeListener["targetArticelObj"][index] 
                                                                            :   storeListener["targetArticelObj"][0]["TotSaldo"]
                                                                        }  
                                                                    </Box>
                                                                </Box>, 
                                                            index === 2 &&
                                                                <Box sx={{height: "65px"}}>                                                                    
                                                                    <Box>{`${item} (${getArticelTot(`NBA ${item}`)} st)`}</Box>
                                                                    <Box sx={{marginTop: "10px"}}>
                                                                        {targetArticelObj.length !== 1
                                                                            ?   storeListener["targetArticelObj"][index] 
                                                                            :   storeListener["targetArticelObj"][0]["NBA Blocked New Sales Order - ValueStr"]
                                                                        }  
                                                                    </Box>
                                                                </Box>,
                                                            index === 3 &&
                                                                <Box sx={{height: "65px"}}>                                                                    
                                                                    <Box>{`${item} (${getArticelTot(`NBA ${item}`)} st)`}</Box>
                                                                    <Box sx={{marginTop: "10px"}}>
                                                                        {targetArticelObj.length !== 1
                                                                            ?   storeListener["targetArticelObj"][index] 
                                                                            :   storeListener["targetArticelObj"][0]["NBA Blocked New Purchase Order - ValueStr"]
                                                                        }  
                                                                    </Box>
                                                                </Box>,                  
                                                    ]   
                                                }
                                            </TableCell>
                                        )
                                    })
                                }
                            </TableRow>   
                        </TableHead>
                        <TableBody>
                            {(isDataReceived === true) &&
                                articelList.map((item: any, index: number) => {
                                    return(
                                        <>
                                            <TableRow>
                                                <TableCell sx={{textAlign: "center"}} colSpan={2} key={`Row${index}-Cell1`}>
                                                    {item["Item No_"]}
                                                </TableCell>
                                                <TableCell sx={{textAlign: "center"}} colSpan={2} key={`Row${index}-Cell2`}>
                                                    {`${item["TotSaldo"] > 0 && "Ja"}  (${item["TotSaldo"]} St)`}
                                                </TableCell>
                                                <TableCell sx={{textAlign: "center"}} colSpan={2} key={`Row${index}-Cell3`}>
                                                    {item["NBA Blocked New Sales Order - ValueStr"]}
                                                </TableCell>
                                                <TableCell sx={{textAlign: "center"}} colSpan={2} key={`Row${index}-Cell4`}>
                                                    {item["NBA Blocked New Purchase Order - ValueStr"]                                                    }
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>    
                </TableContainer>
            </Box>
        }
        </>
    );
}
export default ArticelStatus;