/* ================================================== MainApp ================================================== */
import { AppProps } from 'next/app';

//Redux Store
import { Provider } from "react-redux";
import '../data/LoadingIndicator.css'; 

import {store} from '../store';

import LayoutPage from '../app/layout';

//allReducers.dispatch(combineReducers);
export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <LayoutPage>
        <Component {...pageProps} />
      </LayoutPage>
    </Provider>
  )  
}