import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player/youtube';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { AiOutlineLike } from 'react-icons/ai';
import { abbreviateNumber } from 'js-abbreviation-number';

import { fetchDataFromApi } from '../utils/api';
import { Context } from '../context/contextApi';
import SuggestionVideoCard from './SuggestionVideoCard';

const VideoDetails = () => {
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const { id } = useParams();
  const { setLoading } = useContext(Context);

  useEffect(() => {
    document.getElementById('root').classList.add('custom-h');
    fetchVideoDetails();
    fetchRelatedVideos();

    return () => {
      document.getElementById('root').classList.remove('custom-h');
    };
  }, [id]);

  const fetchVideoDetails = useCallback(() => {
    setLoading(true);
    fetchDataFromApi(`video/details/?id=${id}`)
      .then((res) => {
        setVideo(res);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id, setLoading]);

  const fetchRelatedVideos = useCallback(() => {
    setLoading(true);
    fetchDataFromApi(`video/related-contents/?id=${id}`)
      .then((res) => {
        setRelatedVideos(res?.contents || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id, setLoading]);

  if (!video) {
    return <div className="text-white text-center py-4">Loading Video Details...</div>;
  }

  return (
    <div className="flex justify-center flex-row h-[calc(100%-56px)] bg-black">
      <div className="w-full max-w-[1280px] flex flex-col lg:flex-row">
        {/* Video Player Section */}
        <div className="flex flex-col lg:w-[calc(100%-350px)] xl:w-[calc(100%-400px)] px-4 py-3 lg:py-6 overflow-y-auto">
          <div className="h-[200px] md:h-[400px] lg:h-[400px] xl:h-[550px] ml-[-16px] lg:ml-0 mr-[-16px] lg:mr-0">
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${id}`}
              controls
              width="100%"
              height="100%"
              style={{ backgroundColor: '#000000' }}
              playing
            />
          </div>

          {/* Video Details */}
          <div className="text-white font-bold text-sm md:text-xl mt-4 line-clamp-2">
            {video?.title || 'Untitled Video'}
          </div>

          <div className="flex justify-between flex-col md:flex-row mt-4">
            {/* Author Section */}
            <div className="flex">
              <div className="flex items-start">
                <div className="flex h-11 w-11 rounded-full overflow-hidden">
                  <img
                    className="h-full w-full object-cover"
                    src={video?.author?.avatar[0]?.url || '/default-avatar.png'}
                    alt="channel_logo"
                  />
                </div>
              </div>
              <div className="flex flex-col ml-3">
                <div className="text-white text-md font-semibold flex items-center">
                  {video?.author?.title || 'Unknown Channel'}
                  {video?.author?.badges?.[0]?.type === 'VERIFIED_CHANNEL' && (
                    <BsFillCheckCircleFill className="text-white/[0.5] text-[12px] ml-1" />
                  )}
                </div>
                <div className="text-white/[0.7] text-sm">
                  {video?.author?.stats?.subscribersText || '0 Subscribers'}
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="flex text-white mt-4 md:mt-0">
              <div className="flex items-center justify-center h-11 px-6 rounded-3xl bg-white/[0.15]">
                <AiOutlineLike className="text-xl text-white mr-2" />
                <span>
                  {`${abbreviateNumber(video?.stats?.likes || 0, 2)} Likes`}
                </span>
              </div>

              <div className="flex items-center justify-center h-11 px-6 rounded-3xl bg-white/[0.15] ml-4">
                <span>
                  {`${abbreviateNumber(video?.stats?.views || 0, 2)} Views`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Videos Section */}
        <div className="flex flex-col py-6 px-4 overflow-y-auto lg:w-[350px] xl:w-[400px]">
          {relatedVideos?.map((item, index) => (
            item?.type === 'video' && (
              <SuggestionVideoCard key={index} video={item?.video} />
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;
