import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const Participant = ({ participant, allParticipants, handleLogout }) => {


  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const staffId = useSelector(state => state.loggedIn?.staffId);
  const [isShow, setIsShow] = useState(false);
  const [isMute, setIsMute] = useState(false);

  const videoRef = useRef();
  const audioRef = useRef();

  let staffInfo = JSON.parse(participant.identity)


  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);


  useEffect(() => {

    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));


    const trackSubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }

    };


    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);


  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);


  const handleShow = () => {
    setIsShow(true)
    participant.videoTracks.forEach((publication) => {
      publication.track.disable();
    });
  }

  const handleHide = () => {
    setIsShow(false)
    participant.videoTracks.forEach((publication) => {
      publication.track.enable();
    });
  }


  const handleUnmute = () => {
    setIsMute(true)
    participant.audioTracks.forEach((publication) => {
      publication.track.disable();
    });
  }

  const handleMute = () => {
    setIsMute(false)
    participant.audioTracks.forEach((publication) => {
      publication.track.enable();
    });
  }

  return (
    <div className="participant ">
      <h3>{staffInfo.userName}</h3>
      <video ref={videoRef} autoPlay={true} />
      <audio ref={audioRef} autoPlay={true} />

      {
        staffId == staffInfo.userId &&
        <div className={allParticipants.length > 0 ? "video-phone-btn " : "video-phone-btn"}   >
          <div className="video-cus">

            {
              isShow ?

                <i onClick={handleHide} className="fa fa-video-slash" aria-hidden="true"></i> :
                <i onClick={handleShow} className="fa fa-video-camera" aria-hidden="true"></i>

            }
          </div>
          <div className="phone-cus ml-2">
            {
              isMute ? <i onClick={handleMute} className="fa fa-microphone-slash" aria-hidden="true"></i> :
                <i onClick={handleUnmute} className="fa fa-microphone" aria-hidden="true"></i>

            }
          </div>
          <div className='ml-2'>
        <button onClick={handleLogout} className="end-call-mainbtn"><i className="fa fa-phone end-call-btn" ></i></button>
      </div>

        </div>
        
      }

  
    </div>
  );
};

export default Participant;
