import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';
import Participant from './participant';


const Room = ({ roomName, token, handleLogout, createdBy,setConnecting }) => {



  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);



  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants(prevParticipants => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      let data = JSON.parse(participant.identity)
      if (createdBy == data.userId) {
        handleLogout();
      }
      setParticipants(prevParticipants =>
        prevParticipants.filter(p => p !== participant)
      );
    };


    Video.connect(token, {
      name: roomName,
    }).then(room => {
      setRoom(room);
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
      setConnecting(false)
    });

    return () => {
      setRoom(currentRoom => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(function (trackPublication) {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, token]);


  const remoteParticipants = participants.map(participant => (
    <Participant key={participant.sid} participant={participant} allParticipants={participants}
    handleLogout={handleLogout}
    />
  ));




  return (

    <div className='video-call'>
      <div className="column-room-one">
        <div className="grid-column-one">
          {room ? (
            <Participant
              key={room.localParticipant.sid}
              participant={room.localParticipant}
              allParticipants={participants}
              handleLogout={handleLogout}
            
            />
          ) : (
            ''
          )}
          {remoteParticipants}

        </div>
        {/* {
        room &&
        <div className='d-flex justify-content-center py-3 mt-2 gap-5 custom-button-style position-relative'>
          <button onClick={handleLogout} className="end-call-mainbtn"><i className="fa fa-phone end-call-btn" ></i></button>
        </div>
      } */}
      </div>

 

    </div>

  );


};

export default Room;