import React from 'react';
import YouTube from 'react-youtube';


export default function MovieTrailer({movieDetail}) {




    return (
        <div className="trailer">
            {movieDetail.trailers && movieDetail.trailers.length > 0 ? (
                <YouTube
                    videoId={movieDetail.trailers[0].trailerUrls.split('v=')[1]}
                    opts={{
                        width: '100%',
                        height: '500px',
                        playerVars: {
                            autoplay: 0,
                            rel: 0,
                            modestbranding: 1,
                            controls: 1,
                        },
                    }}
                    onReady={(event) => {
                        event.target.playVideo();
                    }}
                    onEnd={(event) => {
                        event.target.stopVideo();
                    }}
                />
            ) : (
                <p>예고편이 없습니다.</p>
            )}
        </div>
    );
}