'use client';

import { Pepe } from '@/assets';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import 'yet-another-react-lightbox/styles.css';

interface VideoLightboxProps {
  setOpenVideo: Dispatch<SetStateAction<boolean>>;
  openVideo: boolean;
}

const videos = [
  {
    type: "video" as const,
    width: 1280,
    height: 720,
    poster: Pepe.src,
    sources: [
      {
        src: "https://youtu.be/b1k8RdF5u2g?si=C1ENrOcBnwelNRSQ",
        type: "video/mp4",
      },
    ],
  },
];

const VideoLightbox: FC<VideoLightboxProps> = ({ openVideo, setOpenVideo }) => {
  return (
    <div>
      <Lightbox open={openVideo} close={() => setOpenVideo(false)} slides={[...videos]} plugins={[Video]} />
    </div>
  );
};

export default VideoLightbox;
