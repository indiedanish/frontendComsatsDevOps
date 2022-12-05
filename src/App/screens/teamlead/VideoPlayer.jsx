import React, { useEffect, useRef } from 'react';
import AgoraUIKit, { PropsInterface } from 'agora-react-uikit'

export const VideoPlayer = ({ user }) => {
  const ref = useRef();

  useEffect(() => {
    user.videoTrack.play(ref.current);
  }, []);



  return (
    <div>
      Uid: {user.uid}
      <div
        ref={ref}
        style={{ width: '200px', height: '200px' }}
      >
        
      </div>
    </div>
  );
};
