import React, { useState, useCallback, useEffect } from "react";
import Room from "./room";
import { Dialog } from "@progress/kendo-react-dialogs";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { VideoService } from "../../services/videoCallService";
import { ClientService } from "../../services/clientService";
import { NotificationManager } from "react-notifications";
import Loading from "../loader/loader";
import { DecrpytUrl, Encrption, EncrpytUrl, telehealthDecrption } from "../../app-modules/encrption";
import APP_ROUTES from "../../helper/app-routes";
import { renderErrors } from "src/helper/error-message-helper";

const Telehealth = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();


    const staffId = useSelector(state => state.loggedIn?.staffId);

    const [isConnecting, setConnecting] = useState(false)
    const [token, setToken] = useState(null);
    const [isRoomName, setRoomName] = useState()
    const userName = useSelector((state) => state.getStaffReducer?.userName);
   
    const [width, setWidth]   = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const updateDimensions = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }
    useEffect(() => {
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);


    useEffect(() => {
        let isClient = searchParams.get("isClient")
        let userId = searchParams.get("userId")
        let eventId = searchParams.get("eventId")

        if (userId && eventId) {
            getAccessToken(eventId, userId, isClient);
        }

    }, [])


    const getAccessToken = async (eventId, userId, isClient) => {
        let deEventId = telehealthDecrption(eventId)
        let deUserId = telehealthDecrption(userId)
        let newUserName = userName ? userName : ""
        // let isHost = location.state == null ? false : location.state?.eventInfo?.createdBy == deUserId ? true : false
        // let isClientCheck = staffId ? false : true
        setConnecting(true)
        await VideoService.getTelehealthToken(deEventId, newUserName, deUserId, false, isClient)
            .then((result) => {

                let data = result.resultData;
                setToken(data?.jwtToken)
                setRoomName(data?.room.roomId)
                if (data == null) {
                    renderErrors(result.message);
                    setConnecting(false)
                }

            })
            .catch((error) => {
                setConnecting(false)

                //  renderErrors("Something went wrong");
            });
    }



    const handleLogout = () => {
        setToken(null);
        setRoomName(null);

        if(!userName){
         navigate(-1);
        }else{
            window.location.replace(APP_ROUTES.SCHEDULER);
        }

    }


    return (
        <>
            {isConnecting && <Loading />}
            {
                token && <Room
                    roomName={isRoomName}
                    token={token}
                    handleLogout={handleLogout}
                    createdBy={location.state?.eventInfo?.createdBy}
                    setConnecting={setConnecting}

                />

            }
        </>
    )





}


export default Telehealth;