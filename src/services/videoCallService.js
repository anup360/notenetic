import ApiUrls from "../helper/api-urls";
import ApiHelper from "../helper/api-helper";
import moment from 'moment';
import { Encrption } from '../app-modules/encrption';


// const getTelehealthToken = (eventId,userName, isHost) => {
//     return ApiHelper.getRequest(ApiUrls.GET_TELEHEALTH_TOKEN + 'eventId' + "=" + eventId + "&" + "userName" + "=" + userName + "&" + "isHost" + "=" + isHost );

//   };


  const getTelehealthToken = (eventId, userName,userId, isHost, isClient) => {
    var data = {
      "eventId": eventId,
      "userName": userName,
      "userId": userId,
      // "isHost": isHost,
      "isClient": isClient
    }

    return ApiHelper.telehealthPostRequest(ApiUrls.GET_TELEHEALTH_TOKEN, data,);
  };


  const closeTelehealthSession = (roomId) => {
    return ApiHelper.getRequest(ApiUrls.CLOSE_TELEHEALTH_SESSION + roomId );

  };

export const VideoService = {
    getTelehealthToken,
    closeTelehealthSession
};