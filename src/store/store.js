import { legacy_createStore as createStore, applyMiddleware, compose } from "redux";
// import logger from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import appReducer from "../reducers";

const persistConfig = {
    key: 'root',
    storage,
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const persistedReducer = persistReducer(persistConfig, appReducer)
// const appMiddleware = applyMiddleware(logger);
const appMiddleware = applyMiddleware();

const store = createStore(
    persistedReducer,
    composeEnhancers(appMiddleware)
)
const persistor = persistStore(store);
export { store, persistor };
