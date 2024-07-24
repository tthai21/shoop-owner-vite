import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { RootState } from "../redux toolkit/store";
import StoreInfo from "../components/StoreInfo";
import useAuthCheck from "../hooks/useAuthCheck";
import { axiosWithToken } from "../utils/axios";
import { setStoresList } from "../redux toolkit/storesListSlice";

const DashboardPage: React.FC = () => {
  useAuthCheck();
  const [updateTrigger, setUpdateTrigger] = useState<boolean>(false);
  const [selectedStore, setSelectedStore] = useState<number | string>("");
  const dispatch = useDispatch();

  const fetchAllStore = useCallback(async () => {
    try {
      const response = await axiosWithToken.get("/storeConfig/");
      console.log(response.data);
      dispatch(setStoresList(response.data));
    } catch (error) {
      console.error("Error fetching store config:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAllStore();
  }, [fetchAllStore, updateTrigger]);

  const storeConfig = useSelector(
    (state: RootState) => state.storesList.storesList
  );

  useEffect(() => {
    if (storeConfig.length > 0) {
      setSelectedStore(storeConfig[0].id);
    }
  }, [storeConfig]);

  const handleStoreChange = (event: SelectChangeEvent<string | number>) => {
    setSelectedStore(event.target.value as number);
  };

  const selectedStoreInfo = storeConfig.find(
    (store) => store.id === selectedStore
  );

  const handleUpdate = () => {
    setUpdateTrigger((prev) => !prev);
  };

  return (
    <div className="min-h-screen xl:w-[90%] 2xl:w-[80%] mx-auto">
      <div className="flex justify-end items-center mb-4">
        <FormControl variant="outlined" style={{ minWidth: 200 }}>
          <InputLabel id="store-select-label">Select Store</InputLabel>
          <Select
            className="h-[38px]"
            labelId="store-select-label"
            value={selectedStore}
            onChange={handleStoreChange}
            label="Select Store"
          >
            {storeConfig.map((store) => (
              <MenuItem key={store.id} value={store.id}>
                {store.storeName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <button className="btn-primary ml-4 px-4 py-2">Create Store</button>
      </div>
      {storeConfig.length > 0 ? (
        <>
          {selectedStoreInfo && (
            <StoreInfo
              storeUuid={selectedStoreInfo.storeUuid}
              handleUpdate={handleUpdate}
            />
          )}
        </>
      ) : (
        <p>No stores available. Please create a store!</p>
      )}
    </div>
  );
};

export default DashboardPage;
